module.exports = class {
   constructor() {
      this.name = "reset";
      this.alias = [];
      this.usage = "";
   }

   async run(head, client, message, args) {
      if (!message.member.hasPermission("ADMINISTRATOR"))
         return message.channel.send(
            `:x: You do not have permission to run this command in this guild.`
         );
      if (
         (await head.functions.guildIsSetup(head, client, message.guild.id)) ==
         false
      )
         return message.channel.send(`:x: You cannot run this command yet.`);
      head.models.voice_channels.findOne(
         {
            guild_id: message.guild.id
         },
         (err, db) => {
            if (err) return head.error(err);
            if (!db) return head.error(`:x: You cannot run this command yet.`);
            for (const country of Object.keys(head.covid)) {
               db[country] = "none";
            }
            db.save(err => {
               if (err) return head.error(err);
               else
                  return message.channel.send(
                     new head.modules.Discord.MessageEmbed()
                        .setTitle(`Reset Data:`)
                        .setDescription(
                           `**⠀**\nI have reset your voice channel data. This should have fixed any issues if they occurred. If issues still persist, please contact Emissions at [The Hideout Community](https://hideout.community/discord)\n**⠀**`
                        )
                        .setTimestamp()
                  );
            });
         }
      );
   }
};
