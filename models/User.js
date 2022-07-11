const mongoose = require('mongoose');
const Events = require('./Events');
const { Schema } = mongoose
const UserSchema = new Schema({
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   password:{
    type:String,
    required:true
   },
   age:{
    type:Number,
    required:true
   },
   phone:{
    type:Number,
    required:true
   },
   date:{
    type:Date,
    default:Date.now,
   },
   events: [
      {
         type:mongoose.Schema.Types.ObjectId,
         ref: 'events'
      }
  ]
  });
  UserSchema.post('findOneAndDelete', async function (doc) {
   if (doc) {
       console.log('deleting events associated with the user!')
       await Events.deleteMany({
           _id: {
               $in: doc.events
           }
       })
   }
})
  const User=mongoose.model('user',UserSchema);
  module.exports= User;