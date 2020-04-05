const { auth } = require(`../../index`);
module.exports = {
   Discord: require(`discord.js`),
   fs: require(`fs`),
   mongoose: require(`mongoose`),
   djs_commands: require(`djs-commands`),
   request: require(`request-promise-native`),
   himalaya: require(`himalaya`),
   plotly: require(`plotly`)("Emissions", auth.plotly_key),
   axios: require(`axios`),
   // npm i --save TheRealEmissions/djs-commands
};
