module.exports = async (head, client, guild) => {
   head.log(`Joined guild: ${guild.name} (${guild.id})`);
   head.log(`Members: ${guild.memberCount}`);
   let channel = await head.functions.getLogChannel(head, client);
   channel.send(
      new head.modules.Discord.MessageEmbed()
         .setColor(guild.me.displayHexColor)
         .setTitle(`**Joined Guild:**`)
         .addField(`Name:`, `${guild.name}\n*${guild.id}*`, true)
         .addField(`Membercount:`, guild.memberCount, true)
         .setThumbnail(guild.iconURL())
         .setTimestamp()
   );
   head.models.guilds.findOne(
      {
         guild_id: guild.id
      },
      (err, db) => {
         if (err) return head.error(err);
         if (!db) {
            let newdb = new head.models.guilds({
               guild_id: guild.id
            });
            newdb.save(err => {
               if (err) return head.error(err);
            });
         }
      }
   );
};
