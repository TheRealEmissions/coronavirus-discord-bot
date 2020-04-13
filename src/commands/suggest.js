let cooldown = new Set();
module.exports = class {
   constructor() {
      this.name = "suggest";
      this.alias = ["suggestion"];
      this.usage = "";
   }

   async run(head, client, message, args) {
      if (!args[1])
         return message.channel.send(
            `To leave a suggestion, you must actually suggest something.`
         );
      if (cooldown.has(message.author.id))
         return message.channel.send(
            `You are currently on cooldown. You can only suggest once every five minutes!`
         );
      let guild = client.guilds.cache.get("699319118439907449");
      let channel = guild.channels.cache.get("699326342130434188");
      const opt_in = await new Promise(async (resolve, reject) => {
         let m = await message.channel.send(
            new head.modules.Discord.MessageEmbed()
               .setColor(message.guild.me.displayHexColor)
               .setTitle(`Just a confirmation...`)
               .setDescription(
                  `This suggestion will be posted in [The Hideout Community](https://hideout.community/discord). Would you like to provide your User Tag and User Avatar for this suggestion?\n**⠀**\n:white_check_mark: **Yes, I would like to provide my user tag and avatar for this suggestion**\n:x: **No, I would not like to provide my user tag and avatar**\n**⠀**\nYour user tag: \`${message.author.tag}\`\n**⠀**\nYour user tag and avatar are used here:`
               )
               .setImage(`https://i.imgur.com/PrsBMm9.png`)
         );
         let emojis = ["✅", "❌"];
         for (let e of emojis) m.react(e);
         let collector = new head.modules.Discord.ReactionCollector(
            m,
            (r, u) =>
               emojis.includes(r.emoji.name) && u.id == message.author.id,
            { max: 1 }
         );
         collector.on("collect", (r, u) => {
            collector.stop();
            m.delete();
            if (r.emoji.name == emojis[0]) {
               return resolve(true);
            } else return resolve(false);
         });
      });
      const msg = await channel.send(
         new head.modules.Discord.MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTitle(
               `Suggestion${
                  opt_in == true
                     ? ` from **${message.author.tag}**`
                     : ` from **anonymous**`
               }:`
            )
            .setThumbnail(
               opt_in == true
                  ? message.author.avatarURL()
                  : client.user.avatarURL()
            )
            .setDescription(message.content.slice(args[0].length + 1))
            .setTimestamp()
      );
      msg.react(`✅`);
      msg.react(`❌`);
      message.channel.send(
         new head.modules.Discord.MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setDescription(
               `Thank you for your suggestion! Your suggestion has been submitted on [The Hideout Community](https://hideout.community/discord)`
            )
      );
      let log_channel = await head.functions.getLogChannel(head, client);
      log_channel.send(
         new head.modules.Discord.MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`Suggestion Posted:`)
            .addField(
               `User:`,
               `${message.author.tag}\n*${message.author.id}*`,
               true
            )
            .addField(
               `Suggestion:`,
               message.content.slice(args[0].length + 1),
               true
            )
            .addField(`Link:`, `**[HERE](${msg.url})**`, true)
            .setThumbnail(message.author.avatarURL())
            .setFooter(`Guild: ${message.guild.name}`)
            .setTimestamp()
      );
      cooldown.add(message.author.id);
      setTimeout(() => cooldown.delete(message.author.id), 300000);
   }
};
