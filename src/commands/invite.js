module.exports = class {
   constructor() {
      this.name = "invite";
      this.alias = ["join"];
      this.usage = "";
   }

   async run(head, client, message, args) {
      message.channel.send(
         `You can invite this bot to your guild with: https://hideout.community/coronabot`
      );
   }
};
