const { mongoose } = require(`../../index`).modules;
module.exports = mongoose.model(
   `graphs`,
   new mongoose.Schema({
      region: {
         type: String,
         required: true
      },
      url: {
         type: String,
         required: false,
         default: "none"
      },
      other_url: {
         type: String,
         required: false,
         default: "none"
      },
      update_timestamp: {
         type: Date,
         required: true
      }
   })
);
