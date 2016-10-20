// article model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FeedSchema = new Schema({
  title: String,
  author:{
    type:Schema.ObjectId,
    ref:"User"
  },
  text: String,
  meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

FeedSchema.pre("save",function(next){
	if (this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
});

mongoose.model('Feed', FeedSchema);

