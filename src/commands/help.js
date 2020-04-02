module.exports = class {
   constructor() {
      this.name = "help";
      this.alias = [];
      this.usage = "";
   }

   async run(head, client, message, args) {
      message.channel.send(
         new head.modules.Discord.MessageEmbed()
            .setTitle(`Help Menu:`)
            .addField(
               `.corona [country/nation]`,
               `View the latest statistics and predictions on global cases of COVID-19\nSupported countries/nations: ${Object.keys(
                  head.covid
               )
                  .map(o => `${o.toUpperCase()}`)
                  .join(`, `)}`
            )
            .addField(`.source`, `View the source for the data of COVID-19`)
            .addField(`.suggest`, `Leave a suggestion for the bot`)
            .addField(`.setup`, `Setup this guild or edit the current setup`)
            .addField(`.newsletter`, `Opt into or out of the newsletter`)
            .addField(`.info`, `View latest information on COVID-19`)
            .addField(`.invite`, `Invite this bot to your own guild`)
            .addField(`.upvote`, `View links to upvote this bot`)
      );
   }
};
