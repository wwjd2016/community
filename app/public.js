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
						.exec(function(err,shareCategory){
							Article.find({category:shareCategory._id})
									.sort({rep:-1})
									.limit(5)
									.exec(function(err,shareArticles){
										Category.findOne({name:"资讯"})
												.exec(function(err,informationCategory){
													Article.find({category:informationCategory._id})
															.sort({rep:-1})
															.limit(5)
															.exec(function(err,informationArticles){
																	hot_aticle = {
																		shareArticles:shareArticles,
																		informationArticles:informationArticles
																	};
																	cb(hot_aticle)
												})
										
								})
						})
					})
}
exports.clearRecommend = function(){
	hot_aticle = null;
}