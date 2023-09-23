const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imageSchema = mongoose.Schema({
  path: {type: String}
})
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  userID: {
    type: String
  },
  depositAmount:{
    type:Number,
    default:0
  },
  images: [imageSchema],
  isApproved:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
});

module.exports = mongoose.model('Deposit', userSchema);
