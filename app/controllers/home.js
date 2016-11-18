var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Category = mongoose.model('Category');
var User = mongoose.model('User');
var Q = require("q");
var PublicFun = require('../public.js');
module.exports = function (app) {
//首页	
  app.get('/', function (req, res, next) {
  		var tab = req.query.tab?req.query.tab:"all";
  		var page = req.query.page?req.query.page:1;
  		var temp = {}
  		Category.find({},function(err,categorys){
  			if (err) {console.log(err)};
  				if (tab == "all") {
  					temp = {};
			  	}else{
			  		temp = {category:tab}
			  	}
  		Article.count(temp,function(err,counts){
		  		if (err) {console.log(err)};
		  		Article.find(temp)
		  		.skip(20*(parseInt(page)-1))
				.limit(20)
				.sort({"meta.updateAt":-1})
				.populate('author','_id portrait')
				.exec(function (err, articles) {
				    if (err) return next(err);
				    res.render('index', {
				   	  categorys:categorys,
				      category:tab,
				      counts:counts,
				      page:page,
				      title: '微信小程序社区',
				      articles: articles
				    });
				})
		  	})
  		})
})

//段位说明
app.get('/score',function(req,res,next){
	res.render('score',{title:"积分段位说明"})
})
//about
app.get('/about',function(req,res,next){
	res.render('about',{title:"关于我们"});
})

//会员统计和文章
app.get('/publicbase/get',function(req,res,next) {
	PublicFun.recommend(function(data){
		console.log("//////////////"+data)
		User.count({})
		.exec(function(err,count){
			res.json({count:count,data:data})
		})
	});
});
}


		