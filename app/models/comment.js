var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Promise = require("bluebird");

var CommentSchema = new mongoose.Schema({
  article: {type: ObjectId, ref: 'Article'},
  from: {type: ObjectId, ref: 'User'},
  replay: [{
    from: {type: ObjectId, ref: 'User'},
    to: {type: ObjectId, ref: 'User'},
    createAt: Date,
    content: String
  }],
  content: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

CommentSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

mongoose.model('Comment', CommentSchema);

Promise.promisifyAll(mongoose.model('Comment'));
Promise.promisifyAll(mongoose.model('Comment').prototype);