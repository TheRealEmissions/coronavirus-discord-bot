module.exports = class {
   constructor() {
      this.name = "prefix";
      this.alias = [];
      this.usage = "";
   }

   async run(head, client, message, args) {
      if (!message.member.hasPermission("ADMINISTRATOR")) return;
      head.models.guilds.findOne(
         {
            guild_id: message.guild.id
         },
         async (err, db) => {
            if (err) return head.error(err);
            if (!db) {
               db = await new Promise((resolve, reject) => {
                  let newdb = new head.models.guilds({
                     guild_id: message.guild.id
                  });
                  newdb.save(err => {
                     if (err) return reject(err);
                     else {
                        head.models.guilds.findOne(
                           {
                              guild_id: message.guild.id
                           },
                           (err, db) => {
                              if (err) return reject(err);
                              else return resolve(db);
                           }
                        );
                     }
                  });
               }).catch(err => head.error(err));
            }
            if (!args[1])
               return message.channel.send(
                  `:x: To update the prefix, you must state what prefix you wish to change the bot to.`
               );
            const confirmation = await new Promise(async (resolve, reject) => {
               const msg = await message.channel.send(
                  new head.modules.Discord.MessageEmbed()
                     .setColor(message.guild.me.displayHexColor)
                     .setDescription(
                        `Are you sure you want to change the prefix to \`${args[1]}\`?`
                     )
               );
               let emojis = ["✅", "❌"];
               for (let e of emojis) msg.react(e);
               let collector = new head.modules.Discord.ReactionCollector(
                  msg,
                  (r, u) =>
                     emojis.includes(r.emoji.name) && u.id == message.author.id,
                  { max: 1 }
               );
               collector.on("collect", reaction => {
                  msg.reactions.removeAll();
                  return resolve({
                     msg: msg,
                     status: reaction.emoji.name == emojis[0] ? true : false
                  });
               });
            });
            if (confirmation.status == true) {
               db.prefix = args[1].toString();
               db.save(err => {
                  if (err) return head.error(err);
               });
               confirmation.msg.edit(
                  new head.modules.Discord.MessageEmbed()
                     .setColor(message.guild.me.displayHexColor)
                     .setDescription(
                        `Updated prefix to \`${args[1]}\`. You can change the prefix again with \`${args[1]}prefix\`.`
                     )
                     .setTimestamp()
               );
               head.functions.getLogChannel(head, client).then(ch => {
                  ch.send(
                     new head.modules.Discord.MessageEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .setTitle(`Updated Prefix:`)
                        .addField(
                           `**Guild:**`,
                           `${message.guild.name}\n*${message.guild.id}*`,
                           true
                        )
                        .addField(
                           `**User:**`,
                           `${message.author.tag}\n*${message.author.id}*`,
                           true
                        )
                        .addField(
                           `**Prefix:**`,
                           `\`${args[1].toString()}\``,
                           true
                        )
                        .setTimestamp()
                  );
               });
            } else {
               confirmation.msg.delete();
               message.delete();
            }
         }
      );
   }
};
