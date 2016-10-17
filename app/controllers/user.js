var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article = mongoose.model('Article');
var formidable = require('formidable');
var userDirPath = 'public/upload/';
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
module.exports = function (app) {
//限制必须登录操作
app.use(['/user/userCenter','/user/headPortrait','/user/userTopic','/user/messages/details/:id',
	'/user/messages/unread/:id','/user/repassword'],function(req,res,next){
	if (typeof(req.session.userSession) == "undefined")
		return res.redirect("/user/login");
		next();
})
//注册用户
app.get('/user/register',function(req,res,next){
	res.render('register',{
	title:"用户注册"
	})
})
//用户注册提交
app.post('/user/register',function(req,res,next){
	var userObj = req.body;
	var result = userObj.password.match(/^[a-zA-Z][\w]{5,17}$/);//处理密码
  	if (!result)
  		return res.send('密码必须是5-17位,以字母开头,包含字母数字下划线');

	var userEntity = new User(userObj);
	userEntity.save(function(err){
		res.redirect('/user/login');
	})
})
//用户登录
app.get('/user/login',function(req,res,next){
	res.render('login',{
		title:"登录"
	})
})
//用户登录提交
app.post('/user/login',function(req,res,next){
	var userObj = req.body;
	User.findOne({user:userObj.user},function(err,user){
		if (err)  {
			console.log(errr);
			res.send("错误信息:"+err.message);
			return false;
		}

		if (!user) return res.send('用户名不存在');

		user.comparePassword(userObj.password,function(err,isMatch){
			if (!isMatch) return res.send('密码不匹配');
			req.session.userSession = user;
			res.redirect('/');
		})
	})
})

//注销
app.get("/user/loginOut",function(req,res,next){
	delete req.session.userSession;
	res.redirect('/');

})

//个人信息管理
app.get("/user/userCenter",function(req,res,next){
	res.render("userCenter",{title:"个人信息管理"})
})
//个人信息管理提交
app.post("/user/userCenter",function(req,res,next){
	var currentUser = req.session.userSession;
	User.findOne({_id:currentUser._id},function(err,user){
				
			if (err) {
				 console.log(err);
				 res.json({message:2})
			}
			user.signature = req.body.signature;
			user.personUrl = req.body.personUrl;
			user.sex = req.body.sex;
			user.age = parseInt(req.body.age);
			user.city = req.body.city;
			user.profession = req.body.profession;
			user.save(function(err,u){
				if (err) {
					 console.log(err);
				 	 res.json({message:2})
				}
				req.session.userSession = u;
				res.json({message:1});
			})		
})
	
})
//个人头像上传
app.post("/user/headPortrait",function(req,res,next){
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
    form.type = true;
    form.parse(req, function(err, fields, files) {
    	if (err) return res.json({message:"Upload Fail!",error:err});
    	 var extName = ''; //后缀名
        switch (files.upload.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
            case 'image/gif':
            	extName = 'gif';
        }

         if (extName.length === 0) {
            return res.json({
                message:"Upload Fail!",
                error:"只支持jpg,gif,png格式的图片!"
            });
        } 

        var avatarName = Date.now() + '.' + extName;
        var newPath =  '/upload/'+ avatarName;
        var currentUser = req.session.userSession;
        fs.renameSync(files.upload.path, 'public'+newPath);  //重命名
        User.update({_id:currentUser._id},{$set:{
				portrait:newPath
			}},function(err){
			if (err) {
				 	return res.json({
	                	message:"Upload Fail!",
	                	error:err
	           		});
			}
			req.session.userSession.portrait = newPath; 
	           	res.json({
	                message: 'Upload Success!'
	           	});
		})

    })
})

//话题
app.get('/user/userTopic',function(req,res,next){
	var user = req.session.userSession;
	User.findOne({_id:user._id})
		.populate({
			path:'mytopic',
			select:'_id title meta.updateAt category',
			model:'Article',
			populate:{
				path:'category',
				select:'name',
				model:'Category'
			}
		})
		.populate({
			path:'topic',
			select:'_id title meta.updateAt category',
			model:'Article',
			populate:{
				path:'category',
				select:'name',
				model:'Category'
			}
		})
		.exec(function(err,user){
			if (err) {console.log(err)};
			res.render('userTopic',{
				title:'我的话题',
				person:user
			})
		})
})

//查看用户信息
app.get('/user/view/:id',function(req,res,next){
	var userId = req.params.id;
	User.findOne({_id:userId})
		.populate({
			path:'mytopic',
			select:'_id title meta.updateAt category',
			model:'Article',
			populate:{
				path:'category',
				select:'name',
				model:'Category'
			}
		})
		.populate({
			path:'topic',
			select:'_id title meta.updateAt category',
			model:'Article',
			populate:{
				path:'category',
				select:'name',
				model:'Category'
			}
		})
		.exec(function(err,user){
			if (err) {console.log(err)};
			res.render('userView',{
				title:'我的话题',
				person:user
			})
		})
})
//ajax请求未读消息个数
app.post('/user/messages',function(req,res,next){
	User.findOne({_id:req.body.user})
		.exec(function(err,user){
			res.json({
				messages:user.messages
			})
		})
})
//未读消息详情
app.get('/user/messages/details/:id',function(req,res,next){
		User.findOne({_id:req.params.id})
		.populate('messages.article','_id title')
		.populate('messages.from','_id user')
		.populate('messages.to','_id user')
		.exec(function(err,user){
			res.render('messages',{
				title:"查看未读消息",
				messages:user.messages
			})
		})
})

//清除未读消息
app.get('/user/messages/unread/:id',function(req,res,next){
	var uid = req.query.messageUid;
	User.findOne({_id:req.session.userSession._id})
		.exec(function(err,user){
			// user.messages.forEach(function(item,key){
			// 	if (item.uid == uid) {
			// 		item.staus = 1;
			// 		break;
			// 	}
			// });
			if (uid == "all") {
				for(i=0;i<user.messages.length;i++){		
					user.messages[i].staus = 1;
				}
				return	user.save(function(err){
						res.redirect('/')
					})
			}
			for(i=0;i<user.messages.length;i++){
				if (user.messages[i].uid == uid) {
					user.messages[i].staus = 1;
					break;
				}
			}
			user.save(function(err){
				res.redirect('/article/details/'+req.params.id)
			})
		})
})
//修改密码
app.get('/user/repassword',function(req,res,next){
	res.render('repassword',{title:"修改密码"})
})
//修改密码提交
app.post('/user/repassword',function(req,res,next){
	var passwordObj = req.body;
	var result = passwordObj.password.match(/^[a-zA-Z][\w]{5,17}$/);//处理密码
  	if (!result)
  		return res.send('密码必须是5-17位,以字母开头,包含字母数字下划线');
		User.findOne({_id:req.session.userSession._id},function(err,user){
			user.comparePassword(passwordObj.prepassword,function(err,isMatch){
				if (!isMatch) return res.send('原密码不匹配');
				bcrypt.genSalt(10,function(err,salt){
					bcrypt.hash(passwordObj.password,salt,null,function(err,hash){
						user.password = hash;
						user.save(function(err,u){
							if (err) {console.log(err)};
							console.log("fsdfs"+u)
							req.session.userSession = u;
							res.redirect('/user/userCenter');
						})
					})
				})
				
			})
	})

})


};
