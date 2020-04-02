module.exports = class {
   constructor() {
      this.name = "upvote";
      this.alias = [];
      this.usage = "";
   }

   async run(head, client, message, args) {
      message.channel.send(
         new head.modules.Discord.MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`You can upvote us here:`)
            .setDescription(
               `**⠀**\nDiscord Bots List: **[HERE](https://discordbotlist.com/bots/691330203036811335)**\nBots on Discord: **[HERE](https://bots.ondiscord.xyz/bots/691330203036811335)** *(review only)*\n**⠀**\n**Thank you!**`
            )
      );
   }
};
