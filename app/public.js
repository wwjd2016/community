//缓存右侧推荐信息
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Category = mongoose.model('Category');
var User = mongoose.model('User');

var hot_aticle = null;
exports.recommend = function(cb){
	if (hot_aticle!=null) {
		return cb(hot_aticle);
	}
	Category.findOne({name:"分享"})
				.then(function(shareCategory){
					return Article.find({category:shareCategory._id})
								  .sort({rep:-1})
	 							  .limit(5)
				})
				.then(function(shareArticles){
					hot_aticle = {}
					hot_aticle.shareArticles = shareArticles;
					return Category.findOne({name:"资讯"})
				})
				.then(function(informationCategory){
					return Article.find({category:informationCategory._id})
								  .sort({rep:-1})
								   .limit(5)
				})
				.then(function(informationArticles){
					hot_aticle.informationArticles = informationArticles;
					cb(hot_aticle)
				})
				.catch(function(err){
					console.log(err);
				})

}

exports.clearRecommend = function(){
	hot_aticle = null;
}
