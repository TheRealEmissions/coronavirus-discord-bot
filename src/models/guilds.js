const { mongoose } = require(`../../index`).modules;
module.exports = mongoose.model(
   `guilds`,
   new mongoose.Schema({
      guild_id: {
         type: String,
         required: true
      },
      setup: {
         type: Boolean,
         required: false,
         default: false
      },
      prefix: {
         type: String,
         required: false,
         default: "."
      }
   })
);
