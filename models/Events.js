const mongoose = require('mongoose');
const { Schema } = mongoose
const EventSchema = new Schema({
   user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
   },
/*    main_event_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'main_events'
   }, */
   event_name:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true,
   },
   date:{
    type:Date,
    default:Date.now,
   }
  });

  module.exports= mongoose.model('events',EventSchema);