const mongoose = require('mongoose');
const { Schema } = mongoose
const MainEventSchema = new Schema({
   name:{
    type:String
   },
   description:{
    type:String
   },
   date_time:{
    type:String
   }
  });

  module.exports= mongoose.model('main_events',MainEventSchema);