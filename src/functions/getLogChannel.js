module.exports = (head, client) => {
   return new Promise((resolve, reject) => {
      let guild = client.guilds.cache.get(head.channels.guild_id);
      let channel = guild.channels.cache.get(head.channels.log);
      return resolve(channel);
   });
};
