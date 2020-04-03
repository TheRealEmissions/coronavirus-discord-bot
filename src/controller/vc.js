function getVCName(type) {
   let str;
   switch (type) {
      case "global":
         str = "Global Cases: 0";
         break;
      default:
         str = `${
            type.length == 2
               ? type.toUpperCase()
               : type
                    .split("-")
                    .map(s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
                    .join(` `)
         } Cases: 0`;
         break;
   }
   return str;
}

async function updateVC(head, client) {
   let amounts = {};
   for (let country of Object.keys(head.covid)) {
      amounts[country] = await head.functions.getCases(
         head,
         client,
         country == "global" ? null : country
      );
   }
   for (let guild of client.guilds.cache.array()) {
      guild = client.guilds.cache.get(guild.id);
      (async () => {
         let isSetup = await head.functions.guildIsSetup(
            head,
            client,
            guild.id
         );
         if (isSetup === true) {
            head.models.voice_channels.findOne(
               {
                  guild_id: guild.id
               },
               async (err, db) => {
                  if (err) return head.error(err);
                  if (!db) return;
                  let channels = {};
                  for (let country of Object.keys(head.covid)) {
                     channels[country] =
                        typeof db[country] == "undefined"
                           ? null
                           : db[country] == "none"
                           ? null
                           : guild.channels.cache.get(db[country]);
                  }
                  for (const channel of Object.keys(channels)) {
                     (() => {
                        let amount = amounts[channel];
                        let ch = channels[channel];
                        if (ch == null) return;
                        ch.setName(
                           `${
                              getVCName(channel).split(":")[0]
                           }: ${head.functions.addCommasToNo(amount)}`
                        )
                           .then(c =>
                              head.log(
                                 `Updated voice channel "${ch.name}" (${ch.id}) in Guild "${ch.guild.name}" (${ch.guild.id}) with "${c.name}"`
                              )
                           )
                           .catch(err => {
                              head.error(
                                 `Cannot set channel name for channel ${channel} ${db[channel]} in Guild "${guild.name}" (${guild.id})\n${err}`
                              );
                              // head.models.voice_channels.findOne(
                              //    {
                              //       guild_id: guild.id
                              //    },
                              //    (err, db) => {
                              //       if (err) return head.error(err);
                              //       db[channel] = "none";
                              //       db.save(err => {
                              //          if (err) return head.error(err);
                              //       });
                              //    }
                              // );
                           });
                     })();
                  }
               }
            );
         } else {
            return;
         }
      })();
   }
}

module.exports = (head, client) => {
   return new Promise(async (resolve, reject) => {
      if (head.auth.dev_mode == true) return resolve();
      console.time("vc");
      updateVC(head, client);
      setInterval(() => updateVC(head, client), 120000);
      console.timeEnd("vc");
      return resolve();
   });
};
