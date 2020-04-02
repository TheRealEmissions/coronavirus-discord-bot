module.exports = async (head, client, guild) => {
   let color = typeof guild.me == "undefined" ? null : guild.me.displayHexColor;
   if (!color) color = null;
   head.log(`Left guild: ${guild.name} (${guild.id})`);
   head.log(`Members: ${guild.memberCount}`);
   let channel = await head.functions.getLogChannel(head, client);
   channel.send(
      new head.modules.Discord.MessageEmbed()
         .setColor(color)
         .setTitle(`**Left Guild:**`)
         .addField(`Name:`, `${guild.name}\n*${guild.id}*`, true)
         .addField(`Membercount:`, guild.memberCount, true)
         .setThumbnail(guild.iconURL())
         .setTimestamp()
   );
};
