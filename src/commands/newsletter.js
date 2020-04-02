module.exports = class {
   constructor() {
      this.name = "newsletter";
      this.alias = [];
      this.usage = "";
   }

   async run(head, client, message, args) {
      head.models.newsletters.findOne(
         {
            user_id: message.author.id
         },
         async (err, db) => {
            if (err) return head.error(err);
            if (!db) {
               const msg = await message.channel.send(
                  new head.modules.Discord.MessageEmbed()
                     .setColor(
                        message.channel.type == "text"
                           ? message.guild.me.displayHexColor
                           : null
                     )
                     .setTitle(`Newsletter:`)
                     .setDescription(
                        `Our opt-in service will provide you with the latest updates as soon as they're released. To opt-in, simply select :white_check_mark: below, otherwise select :x: if you are not interested. \n**To be eligible for this service, you must have DMs enabled for this bot!**`
                     )
               );
               let emojis = ["✅", "❌"];
               for (let e of emojis) msg.react(e);
               let collector = new head.modules.Discord.ReactionCollector(
                  msg,
                  (reaction, user) =>
                     emojis.includes(reaction.emoji.name) &&
                     user.id == message.author.id,
                  { max: 1 }
               );
               collector.on("collect", (reaction, user) => {
                  collector.stop();
                  if (reaction.emoji.name == emojis[0]) {
                     msg.reactions.removeAll();
                     msg.edit(
                        new head.modules.Discord.MessageEmbed()
                           .setColor(
                              message.channel.type == "text"
                                 ? message.guild.me.displayHexColor
                                 : null
                           )
                           .setTitle(`Newsletter:`)
                           .setDescription(
                              `Thanks for opting into our newsletter! You can opt-out of the newsletter at any-time by running this command.`
                           )
                           .setTimestamp()
                           .setThumbnail(message.author.avatarURL())
                     );
                     head.functions.getLogChannel(head, client).then(ch => {
                        ch.send(
                           new head.modules.Discord.MessageEmbed()
                              .setColor(
                                 message.channel.type == "text"
                                    ? message.guild.me.displayHexColor
                                    : null
                              )
                              .setTitle(`**Newsletter Opt-in:**`)
                              .addField(
                                 `User:`,
                                 `${message.author.tag}\n*${message.author.id}*`,
                                 true
                              )
                              .addField(
                                 `Guild:`,
                                 `${
                                    message.channel.type == "text"
                                       ? `${msg.guild.name}\n*${msg.guild.id}*`
                                       : `N/A`
                                 }`,
                                 true
                              )
                              .setThumbnail(message.author.avatarURL())
                              .setTimestamp()
                        );
                     });
                     let newdb = new head.models.newsletters({
                        user_id: message.author.id,
                        joined_timestamp: new Date()
                     });
                     newdb.save(err => {
                        if (err) return head.error(err);
                     });
                     return;
                  } else {
                     msg.delete();
                     if (message.channel.type == "text") message.delete();
                     return;
                  }
               });
            } else {
               const msg = await message.channel.send(
                  new head.modules.Discord.MessageEmbed()
                     .setColor(
                        message.channel.type == "text"
                           ? message.guild.me.displayHexColor
                           : null
                     )
                     .setTitle(`Newsletter:`)
                     .setDescription(
                        `You are currently opting into our newsletter service. You can opt-out of this service by selecting 🇽 below. Otherwise select ❌ to remove this message.\n**⠀**\nYou opted into the newsletter service on \`${new Date(
                           db.joined_timestamp
                        ).getDate()}/${new Date(
                           db.joined_timestamp
                        ).getMonth() + 1}/${new Date(
                           db.joined_timestamp
                        ).getFullYear()}\` at \`${new Date(
                           db.joined_timestamp
                        ).getUTCHours()}:${new Date(
                           db.joined_timestamp
                        ).getUTCMinutes()}:${new Date(
                           db.joined_timestamp
                        ).getUTCSeconds()}\``
                     )
               );
               let emojis = ["🇽", "❌"];
               for (let e of emojis) msg.react(e);
               let collector = new head.modules.Discord.ReactionCollector(
                  msg,
                  (reaction, user) =>
                     emojis.includes(reaction.emoji.name) &&
                     user.id == message.author.id,
                  { max: 1 }
               );
               collector.on("collect", (reaction, user) => {
                  collector.stop();
                  if (reaction.emoji.name == emojis[0]) {
                     msg.reactions.removeAll();
                     head.models.newsletters.deleteOne(
                        {
                           user_id: message.author.id
                        },
                        err => {
                           if (err) return head.error(err);
                           else {
                              msg.edit(
                                 new head.modules.Discord.MessageEmbed()
                                    .setColor(
                                       message.channel.type == "text"
                                          ? message.guild.me.displayHexColor
                                          : null
                                    )
                                    .setTitle(`Newsletter:`)
                                    .setDescription(
                                       `You have opted out of the newsletter service. You can join back at any time using this command!`
                                    )
                                    .setTimestamp()
                              );
                              head.functions
                                 .getLogChannel(head, client)
                                 .then(ch => {
                                    ch.send(
                                       new head.modules.Discord.MessageEmbed()
                                          .setTitle(`**Newsletter Opt-out:**`)
                                          .setThumbnail(
                                             message.author.avatarURL()
                                          )
                                          .setTimestamp()
                                          .addField(
                                             `User:`,
                                             `${message.author.tag}\n*${message.author.id}*`,
                                             true
                                          )
                                          .addField(
                                             `Guild:`,
                                             message.channel.type == "text"
                                                ? `${message.guild.name}\n*${message.guild.id}*`
                                                : `N/A`,
                                             true
                                          )
                                    );
                                 });
                              return;
                           }
                        }
                     );
                     return;
                  } else {
                     msg.delete();
                     if (message.channel.type == "text") message.delete();
                     return;
                  }
               });
            }
         }
      );
   }
};
