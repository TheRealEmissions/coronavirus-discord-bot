module.exports = class {
   constructor() {
      this.name = "source";
      this.alias = [];
      this.usage = "";
   }

   async run(head, client, message, args) {
      message.channel.send(
         `All data is collected from: https://www.worldometers.info/coronavirus/`
      );
   }
};
