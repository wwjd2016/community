// article model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  author:{
    type:Schema.ObjectId,
    ref:"User"
  },
  describe:String,
  category:{
    type:Schema.ObjectId,
    ref:"Category"
  },
  text: String,
  cli:{
    type:Number,
    default:0
  },
  rep:{
    type:Number,
    default:0
  },
  meta:{
        createAt:{//创建时间
            type:Date,
            default:Date.now()
        },
        updateAt:{//最后评论时间
            type:Date,
            default:Date.now()
        }
    }
});

ArticleSchema.pre("save",function(next){
	   if (this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    // else{
    //     this.meta.updateAt = Date.now();
    // }
    next();
});

mongoose.model('Article', ArticleSchema);

