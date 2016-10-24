var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');
var Category = mongoose.model('Category');
var Comment = mongoose.model('Comment');
var ueditor = require("ueditor");
var path = require('path');
module.exports = function (app) {
		//限制必须登录操作
app.use(['/article/comment','/ueditor/article','/article/new','/article/editor/:id','/article/editor/category','/article/delete/:id'],function(req,res,next){
	if (typeof(req.session.userSession) == "undefined")
		return res.redirect("/user/login");
	next();
})
//发布文章
app.get('/article/new',function(req,res,next){
	Category.find({})
	.exec(function(err,categorys){
				res.render('newArticle',{
					title:"发布文章",
					categorys:categorys,
					mark:"new",
					article:{
						title:"",
				  		describe:"",
				  		category:"",
				  		text:""
					}
				})
		})
})
//修改文章
app.get('/article/editor/:id',function(req,res,next){
	var articleId = req.params.id;
	Article.findOne({_id:articleId})
			.populate('category','name')
			.exec(function(err,article){
				if (err) {console.log(err)};
				Category.find({},function(err,categorys){
					if (err) {console.log(err)};
					res.render('newArticle',{
						title:"修改文章",
						categorys:categorys,
						mark:articleId,
						article:article
					})
				})
			})
})
//ueditor富文本编辑器请求
app.use("/ueditor/article", ueditor(path.join(__dirname, '../../public'), function (req, res, next) {
  // ueditor 客户发起上传图片请求
  if (req.query.action === 'uploadimage') {
    var foo = req.ueditor;

    var imgname = req.ueditor.filename;
    var times = new Date();
    var img_url = '/img/ueditor/'+times.getFullYear().toString()+times.getMonth().toString()+'/';
    res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {
    var dir_url = '/img/ueditor/'
    res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {
    // console.log('config.json')
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/jsp/config.json');
  }
}));
//post修改文章
app.post('/article/new',function(req,res,next){
	var articleObj = req.body;
	if (articleObj.editorMark == "new") {
		return next()
	}else{
		Article.findOne({_id:articleObj.editorMark},function(err,article){
			if (err) {console.log(err)};
			article.title = articleObj.title;
			article.describe = articleObj.describe;
			article.category = articleObj.category;
			article.text = articleObj.text;
			article.save(function(err){
				if (err) {console.log(err)};
				res.redirect('/article/details/'+article._id);
			})
		})
	}
})
//修改分类
app.post('/article/editor/category',function(req,res,next){
	var data = req.body;
	if (data.category == data.categoryChange) {
		return res.json({
			message:"0"
		});
	}
	Category.findOne({_id:data.category},function(err,category){
		if (err) {console.log(err)};
		var index = category.article.indexOf(data.articleId);
		category.article.splice(index,1);
		category.save(function(err){
			if (err) {console.log(err)};
			Category.findOne({_id:data.categoryChange},function(err,categoryChange){
			if (err) {console.log(err)};
				categoryChange.article.push(data.articleId);
				categoryChange.save(function(err){
					if (err) {console.log(err)};
					Article.findOne({_id:data.articleId},function(err,article){
						if (err) {console.log(err)};
						article.category = data.categoryChange;
						article.save(function(err){
							if (err) {console.log(err)};
							res.json({
								message:"1"
							});
						})
					})
				})
				
			})
		})
	})
})
  //post文章
app.post('/article/new', function (req, res, next) {
  	var articleObj = req.body;
  	var author = req.session.userSession._id;
  	var articleEntity = new Article({
	  		title:articleObj.title,
	  		author:author,
	  		describe:articleObj.describe,
	  		category:articleObj.category,
	  		text:articleObj.text
	  	});
  	articleEntity.save(function(err,article){
  		if (err) {console.log(err)};
  		Category.findOne({_id:articleObj.category},function(err,category){
  			if (err) {console.log(err)};
  			category.article.push(article._id);
  			category.save(function(err){
  				if (err) {console.log(err)};
  				User.findOne({_id:author},function(err,user){
			  		if (err) {console.log(err)};
			  		user.mytopic.push(article._id);//我的话题存储到user文档中
			  		user.score = user.score+2;//发布一篇文章加2分
			  		user.save(function(err,u){
			  			if (err) {console.log(err)};
			  			req.session.userSession = u;
			  			res.redirect('/');
			  		});
		  		})
  				
  			})
  		})

  	})
  	
});
//统计评论数
app.post('/article/comment',function(req,res,next){
	var commentObj = req.body;
	Article.findOne({_id:commentObj.articleId},function(err,article){
		if (err) {console.log(err)};
		article.rep = article.rep+1;//评论数加1
		article.meta.updateAt = Date.now();//存储最新评论时间
		article.save(function(err){
			if (err) {console.log(err)};
			next();
		})
	})
})
//主评论post
app.post('/article/comment',function(req,res,next){
	var commentObj = req.body;
	function isNull( str ){//判断输入是否为空字符串
		if ( str == "" ) return true;
		var regu = "^[ ]+$";
		var re = new RegExp(regu);
		return re.test(str);
	}
	if (isNull(commentObj.content)) {
		return res.render("messageTip",{
			title:"温馨提示",
			messages:"评论内容不能为空!"
		})
	}
	if (commentObj.to == "main") {
		var CommentEntity = new Comment({
			article:commentObj.articleId,
			from:req.session.userSession._id,
			content:commentObj.content
		});
		CommentEntity.save(function(err,comment){
			if (err) {console.log(err)};
			User.findOne({_id:req.session.userSession._id})
				.exec(function(err,user){
			  		if (err) {console.log(err)};
			  		var result = user.mytopic.indexOf(commentObj.articleId);//判断是否是自己发布的
			  		if (result != -1) {
			  			return res.redirect('/article/details/'+commentObj.articleId);
			  		}
			  				User.findOne({_id:commentObj.authorId},function(err,author){//存储到用户中的消息
			  					if (err) {console.log(err)};
			  					author.messages.push({
			  						uid:Date.now().toString()+req.session.userSession._id.toString(),
			  						article:commentObj.articleId,
			  						from:req.session.userSession._id,
			  						to:commentObj.authorId,
			  						content:commentObj.content
			  					});
			  					author.save(function(err){
			  						if (err) {console.log(err)};
			  					})
			  				})
			  		
			  		var result = user.topic.indexOf(commentObj.articleId);//判断是否已经存储
			  		if (result != -1) {
			  			return res.redirect('/article/details/'+commentObj.articleId);
			  		}
			  		user.topic.push(commentObj.articleId);//我参与的话题存储到user文档中
					user.score = user.score+1;//发布一篇文章加2分
			  		user.save(function(err,u){
			  			if (err) {console.log(err)};
			  			req.session.userSession = u;
			  			res.redirect('/article/details/'+commentObj.articleId)

			  		});
		  		})
		})
	}else{
		next();
	}
})
//回复评论post
app.post('/article/comment',function(req,res,next){
	var commentObj = req.body;
	Comment.findOne({_id:commentObj.commentId},function(err,comment){
		if (err) {console.log(err)};
		comment.replay.push({
			from:req.session.userSession._id,
			to:commentObj.to,
			content:commentObj.content
		})
		comment.save(function(err){
			if (err) {console.log(err)};
			User.findOne({_id:req.session.userSession._id},function(err,user){
			  		if (err) {console.log(err)};
			  		var result = user.mytopic.indexOf(commentObj.articleId);//判断是否是自己发布的
			  		if (result != -1) {
			  			return res.redirect('/article/details/'+commentObj.articleId);
			  		}
			  		User.findOne({_id:commentObj.authorId})
			  				.exec(function(err,author){//存储到用户中的消息
			  					if (err) {console.log(err)};
			  					author.messages.push({
			  						uid:Date.now().toString()+req.session.userSession._id.toString(),
			  						article:commentObj.articleId,
			  						from:req.session.userSession._id,
			  						to:commentObj.to,
			  						content:commentObj.content
			  					});
			  					author.save(function(err){
			  						if (err) {console.log(err)};
			  						if (commentObj.to == commentObj.authorId) {
			  							return 
			  						}
			  						User.findOne({_id:commentObj.to})
					  				.exec(function(err,author){//存储到用户中的消息
					  					if (err) {console.log(err)};
					  					author.messages.push({
					  						uid:Date.now().toString()+req.session.userSession._id.toString(),
					  						article:commentObj.articleId,
					  						from:req.session.userSession._id,
					  						to:commentObj.to,
					  						content:commentObj.content
					  					});
					  					author.save(function(err){
					  						if (err) {console.log(err)};
					  					})
					  				})
			  					})
			  				})
			  		
			  		var result = user.topic.indexOf(commentObj.articleId);//判断是否已经存储
			  		if (result != -1) {
			  			return res.redirect('/article/details/'+commentObj.articleId);
			  		}
			  		user.topic.push(commentObj.articleId);//我参与的话题存储到user文档中
			  		user.score = user.score+1;//发布一篇文章加2分
			  		user.save(function(err,u){
			  			if (err) {console.log(err)};
			  				req.session.userSession = u;
					  		res.redirect('/article/details/'+commentObj.articleId);
			  		});
		  		})
		})
	})
	
})
//统计点击数
app.get('/article/details/:id',function(req,res,next){
	var articleId = req.params.id;
	Article.findOne({_id:articleId},function(err,article){
		if (err) {console.log(err)};
		article.cli = article.cli+1;
		article.save(function(err){
			if (err) {console.log(err)};
			next();
		})
	})
})
//文章详情页
app.get('/article/details/:id',function(req,res,next){
	var articleId = req.params.id;
	Article.findOne({_id:articleId})
			.populate('author','_id user')
			.populate('category','_id name')
			.exec(function(err,article){
				if (err) {console.log(err)};
				Comment.find({article:articleId})
				.populate('from','_id user portrait')
				.populate('replay.from','_id user portrait')
				.populate('replay.to','_id user portrait')
				.exec(function(err,comment){
					if (err) {console.log(err)};
					res.render("articleDetails",{
						title:article.title,
						article:article,
						comment:comment
					})
				})
			})
})
//文章删除
app.get('/article/delete/:id',function(req,res,next){
	var articleId = req.params.id;
	var categoryId = req.query.category;
	var authorId = req.query.author;
	Article.remove({_id:articleId})
			.exec(function(err){
				if (err) {console.log(err)};
				User.findOne({_id:authorId})
				.exec(function(err,user){//从我的话题中删除
					if (err) {console.log(err)};
					var result1 = user.mytopic.indexOf(articleId);
					var result2 = user.topic.indexOf(articleId);
					if (result1 != -1) {
						user.mytopic.splice(result1,1)
					}
					if (result2 != -1) {
						user.topic.splice(result2,1)
					}
					user.save(function(err){
						Category.findOne({_id:categoryId})
							.exec(function(err,category){//删除评论
								if (err) {console.log(err)};
								category.article.splice(category.article.indexOf(articleId),1);
								category.save(function(err){
									if (err) {console.log(err)};
									Comment.remove({article:articleId})
										.exec(function(err){
											if (err) {console.log(err)};
											res.redirect('/admin/category?name='+category.name);
										})
								})
								
							})
					})
					
				})
			})
})
};


