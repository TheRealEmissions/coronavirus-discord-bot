const { mongoose } = require(`../../index`).modules;
module.exports = mongoose.model(
   `voice_channels`,
   new mongoose.Schema({
      guild_id: {
         type: String,
         required: true
      },
      global: {
         type: String,
         required: false,
         default: "none"
      },
      uk: {
         type: String,
         required: false,
         default: "none"
      },
      us: {
         type: String,
         required: false,
         default: "none"
      },
      china: {
         type: String,
         required: false,
         default: "none"
      },
      italy: {
         type: String,
         required: false,
         default: "none"
      },
      spain: {
         type: String,
         required: false,
         default: "none"
      },
      germany: {
         type: String,
         required: false,
         default: "none"
      },
      iran: {
         type: String,
         required: false,
         default: "none"
      },
      france: {
         type: String,
         required: false,
         default: "none"
      },
      switzerland: {
         type: String,
         required: false,
         default: "none"
      },
      "south-korea": {
         type: String,
         required: false,
         default: "none"
      },
      netherlands: {
         type: String,
         required: false,
         default: "none"
      },
      austria: {
         type: String,
         required: false,
         default: "none"
      },
      belgium: {
         type: String,
         required: false,
         default: "none"
      },
      turkey: {
         type: String,
         required: false,
         default: "none"
      },
      canada: {
         type: String,
         required: false,
         default: "none"
      },
      portugal: {
         type: String,
         required: false,
         default: "none"
      },
      norway: {
         type: String,
         required: false,
         default: "none"
      },
      brazil: {
         type: String,
         required: false,
         default: "none"
      },
      israel: {
         type: String,
         required: false,
         default: "none"
      },
      australia: {
         type: String,
         required: false,
         default: "none"
      }
   })
);
