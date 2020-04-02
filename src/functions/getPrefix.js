module.exports = (head, client, guild) => {
   return new Promise((resolve, reject) => {
      head.models.guilds.findOne(
         {
            guild_id: typeof guild == "string" ? guild : guild.id
         },
         (err, db) => {
            if (err) return reject(err);
            if (!db) {
               let newdb = new head.models.guilds({
                  guild_id: typeof guild == "string" ? guild : guild.id
               });
               newdb.save(err => {
                  if (err) return reject(err);
                  else return resolve(`.`);
               });
               return;
            }
            return resolve(db.prefix);
         }
      );
   });
};
