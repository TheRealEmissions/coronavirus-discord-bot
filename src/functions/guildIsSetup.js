module.exports = (head, client, guild) => {
   return new Promise((resolve, reject) => {
      head.models.guilds.findOne(
         {
            guild_id: typeof guild == "string" ? guild : guild.id
         },
         (err, db) => {
            if (err) return reject(err);
            if (!db) return resolve(false);
            if (db.setup == false) return resolve(false);
            else return resolve(true);
         }
      );
   });
};
