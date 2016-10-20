var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var User = mongoose.model('User');
var Feed = mongoose.model('Feed');

module.exports = function (app) {
  //限制权限、以及登录状态
app.use(/\/admin/,function(req,res,next){//后台管理页面验证登录状态以及权限
  if (typeof(req.session.userSession) == "undefined")
    return res.redirect("/user/login");
  else if(req.session.userSession.power != 20)
    return res.redirect("/user/login");
  next();
})
//后台首页
app.get('/admin',function(req,res,next){
  res.render('admin',{title:"后台管理系统"});
})
//新增分类页面
app.get('/admin/newCategory', function (req, res, next) {
	Category.find(function(err,categorys){
		if (err) {
			console.log(err);
		}
		res.render('newCategory',{
  	title:"新增分类",
  	categorys:categorys
  })
	})	  
})
//提交新增分类页面
app.post('/admin/newCategory',function(req,res,next){
	var categoryEntity = new Category({
		name:req.body.category
	});
	categoryEntity.save(function(err){
		if (err) {
			console.log(err)
		}
		res.redirect('/admin/newCategory');
	})
})
//查看分类
app.get('/admin/category',function(req,res,next){
	var categoryName = req.query.name;
	Category.findOne({name:categoryName})
          .populate({
            path:'article',
            select:'_id title author meta.createAt',
            model:'Article',
            populate:{
              path:'author',
              select:'user',
              model:'User'
            }
          })
          .exec(function(err,category){
            if (err) {
              console.log(err)
            }
            res.render('categoryDetails',{
              title:categoryName,
              category:category
            })
          })
})
//删除分类
app.get('/admin/category/delete',function(req,res,next){
	var categoryName = req.query.name;
	Category.remove({name:categoryName},function(err){
		if (err) {
			console.log(err)
		}
		res.redirect('/admin/newCategory');
	})
})
//用户管理
app.get('/admin/users',function(req,res,next){
  User.find({},function(err,users){
    if (err) {console.log(err)};
    res.render('users',{title:"用户列表",users:users})
  })
})
//反馈管理
app.get("/admin/feedbacks",function(req,res,next){
  Feed.find({})
      .populate('author','user _id')
      .exec(function(err,feedbacks){
        res.render("feedList",{
          title:"反馈列表",
          feedbacks:feedbacks
        })
      })
})
};
