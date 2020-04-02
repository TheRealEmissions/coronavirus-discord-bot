const { mongoose } = require(`../../index`).modules;
module.exports = mongoose.model(
   `newsletters`,
   new mongoose.Schema({
      user_id: {
         type: String,
         required: true
      },
      joined_timestamp: {
         type: Date,
         required: false,
         default: new Date()
      }
   })
);
