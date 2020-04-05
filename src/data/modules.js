const head = require(`../../index`);
module.exports = {
   Discord: require(`discord.js`),
   fs: require(`fs`),
   mongoose: require(`mongoose`),
   djs_commands: require(`djs-commands`),
   request: require(`request-promise-native`),
   himalaya: require(`himalaya`),
   plotly: require(`plotly`)("Emissions", require(`./auth`).plotly_key),
   axios: require(`axios`),
   ddbl: new (require(`ddblapi.js`).ddblAPI)(
      "691330203036811335",
      require(`./auth`).ddbl_key
   ),
   // npm i --save TheRealEmissions/djs-commands
};
