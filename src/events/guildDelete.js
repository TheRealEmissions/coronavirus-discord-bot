module.exports = async (head, client, guild) => {
   head.log(`Left guild: ${guild.name} (${guild.id})`);
   head.log(`Members: ${guild.memberCount}`);
   let channel = await head.functions.getLogChannel(head, client);
   channel.send(
      new head.modules.Discord.MessageEmbed()
         .setColor(guild.me.displayHexColor)
         .setTitle(`**Left Guild:**`)
         .addField(`Name:`, `${guild.name}\n*${guild.id}*`, true)
         .addField(`Membercount:`, guild.memberCount, true)
         .setThumbnail(guild.iconURL())
         .setTimestamp()
   );
};
