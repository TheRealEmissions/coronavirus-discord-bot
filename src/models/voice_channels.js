const head = require(`../../index`);
const { mongoose } = head.modules;
let obj = {};
for (const country of Object.keys(head.covid)) {
   Object.assign(obj, {
      [country]: {
         type: String,
         required: false,
         default: "none",
      },
   });
}
module.exports = mongoose.model(
   `voice_channels`,
   new mongoose.Schema({
      guild_id: {
         type: String,
         required: true,
      },
      ...obj,
   })
);
