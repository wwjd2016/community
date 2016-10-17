// user model
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Promise = require("bluebird");

var UserSchema = new Schema({
  user:{
        type:String,
        unique:true
  },
  power:{//超级管理员20
    type:Number,
    default:1
  },
  score:{
    type:Number,
    default:0
  },
  mytopic:[
    {type:Schema.ObjectId,ref:"Article"}
  ],
  topic:[
    {type:Schema.ObjectId,ref:"Article"}
  ],
  password:String,
  sex:{
    type:Number,
    default:0
  },
  age:{
    type:Number,
    default:0
  },
  profession:{
    type:String,
    default:"前端"
  },
  city:{
    type:String,
    default:"北京丰台"
  },
  portrait:{
    type:String,
    default:"/img/default/head.jpg"
  },
  signature:{
    type:String,
    default:"这家伙很懒,什么都没留下."
  },
  email:String,
  personUrl:{
    type:String,
    default:"添加我的个人网站"
  },
  messages:[
    {
      uid:String,//评论人id加上当前时间
      article:{type: Schema.ObjectId, ref: 'Article'},
      from:{type: Schema.ObjectId, ref: 'User'},
      to:{type: Schema.ObjectId, ref: 'User'},
      content:String,
      createAt:{
            type:Date,
            default:Date.now()
        },
      staus:{
        type:Number,
        default:0
      }
    }
    ],
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

UserSchema.pre("save",function(next){
  var user = this;
	if (this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
          bcrypt.genSalt(10,function(err,salt){
        if (err) return next(err);
        bcrypt.hash(user.password,salt,null,function(err,hash){
          if (err) return next(err);
          user.password = hash;
           next(); 
        })
      })
    }else{
        this.meta.updateAt = Date.now();
        next(); 
    }

});

UserSchema.methods = {
  comparePassword:function(_password,cb){
    bcrypt.compare(_password, this.password,function(err,isMatch){
      if (err) return cb(err);
        cb(null, isMatch)
    })
  }
}

mongoose.model('User', UserSchema);

Promise.promisifyAll(mongoose.model('User'));
Promise.promisifyAll(mongoose.model('User').prototype);