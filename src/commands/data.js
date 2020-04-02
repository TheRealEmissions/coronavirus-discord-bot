module.exports = class {
   constructor() {
      this.name = "data";
      this.alias = [];
      this.usage = "";
   }

   async run(head, client, message, args) {
      if (message.author.id != "201095756784992256") return;
      const newsletter = await new Promise((resolve, reject) => {
         head.models.newsletters
            .find({})
            .lean()
            .exec((err, docs) => {
               if (err) return reject(err);
               return resolve(docs.length);
            });
      }).catch(e => head.error(e));
      let membercount = 0;
      for (let guild of client.guilds.cache.array())
         membercount += Number(guild.memberCount);
      const voice_channels = await new Promise((resolve, reject) => {
         let no = 0;
         head.models.voice_channels
            .find({})
            .lean()
            .exec((err, docs) => {
               if (err) return reject(err);
               for (let doc of docs) {
                  for (let v of Object.keys(doc)) {
                     if (v == "_id" || v == "guild_id" || v == "__v") continue;
                     if (doc[v] == "none") continue;
                     no++;
                  }
               }
               return resolve(no);
            });
      });
      message.channel.send(
         `Guilds: **${
            client.guilds.cache.array().length
         }**\nNewsletter opt-ins: **${newsletter}**\nTotal Member Count: **${head.functions.addCommasToNo(
            membercount
         )}**\nVoice channels: **${voice_channels}**`
      );
   }
};
