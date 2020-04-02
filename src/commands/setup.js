module.exports = class {
   constructor() {
      this.name = "setup";
      this.alias = [];
      this.usage = "";
      this.emojis = [
         {
            continent: "other",
            emoji: "🇦",
            data: [
               {
                  emoji: "🇦",
                  country: "global"
               }
            ]
         },
         {
            continent: "europe",
            emoji: "🇧",
            data: [
               {
                  emoji: "🇦",
                  country: "uk"
               },
               {
                  emoji: "🇧",
                  country: "italy"
               },
               {
                  emoji: "🇨",
                  country: "spain"
               },
               {
                  emoji: "🇩",
                  country: "germany"
               },
               {
                  emoji: "🇪",
                  country: "france"
               },
               {
                  emoji: "🇫",
                  country: "switzerland"
               },
               {
                  emoji: "🇬",
                  country: "netherlands"
               },
               {
                  emoji: "🇭",
                  country: "austria"
               },
               {
                  emoji: "🇮",
                  country: "belgium"
               },
               {
                  emoji: "🇯",
                  country: "portugal"
               },
               {
                  emoji: "🇰",
                  country: "norway"
               }
            ]
         },
         {
            continent: "america",
            emoji: "🇨",
            data: [
               {
                  emoji: "🇦",
                  country: "us"
               },
               {
                  emoji: "🇧",
                  country: "canada"
               },
               {
                  emoji: "🇨",
                  country: "brazil"
               }
            ]
         },
         {
            continent: "asia",
            emoji: "🇩",
            data: [
               {
                  emoji: "🇦",
                  country: "china"
               },
               {
                  emoji: "🇧",
                  country: "south-korea"
               },
               {
                  emoji: "🇨",
                  country: "iran"
               },
               {
                  emoji: "🇩",
                  country: "turkey"
               },
               {
                  emoji: "🇪",
                  country: "israel"
               }
            ]
         },
         {
            continent: "oceania",
            emoji: "🇪",
            data: [
               {
                  emoji: "🇦",
                  country: "australia"
               }
            ]
         }
      ];
   }

   getChannels(head, client, message) {
      return new Promise((resolve, reject) => {
         head.models.voice_channels.findOne(
            {
               guild_id: message.guild.id
            },
            async (err, db) => {
               if (err) return reject(err);
               if (!db) {
                  await new Promise((resolve, reject) => {
                     let newdb = new head.models.voice_channels({
                        guild_id: message.guild.id
                     });
                     newdb.save(err => {
                        if (err) return reject(err);
                        else return resolve();
                     });
                  }).catch(reject);
               }
               let guild = await client.guilds.cache.get(message.guild.id);
               let channel = {};
               for (let country of Object.keys(head.covid)) {
                  channel[country] =
                     typeof db[country] == "undefined"
                        ? "none"
                        : db[country] == "none"
                        ? "none"
                        : guild.channels.cache.get(db[country]);
               }
               return resolve(channel);
            }
         );
      });
   }

   // data:
   // msg (obj)
   // white_check_mark (boolean)
   // channel (obj)
   getCategory(head, message, em, data = {}) {
      return new Promise(async (resolve, reject) => {
         let embed = em;
         for (let o of this.emojis) {
            let obj = {
               name: `${o.emoji} **${o.continent
                  .split("-")
                  .map(s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
                  .join(` `)}**`,
               value: "",
               inline: true
            };
            for (let x of this.emojis.find(x => x == o).data) {
               obj.value = obj.value.concat(
                  `${
                     x.country.length == 2
                        ? x.country.toUpperCase()
                        : x.country
                             .split("-")
                             .map(
                                s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`
                             )
                             .join(` `)
                  }: ${
                     data.channel[x.country] == "none"
                        ? `:x:`
                        : `:white_check_mark:`
                  }\n`
               );
            }
            embed.fields.push(obj);
            continue;
         }
         let m =
            data.msg == null
               ? await message.channel.send({ embed: embed }).catch(reject)
               : data.msg;
         let isInCycle =
            typeof data.cycle == "undefined"
               ? false
               : data.cycle == true
               ? true
               : false;
         if (data.msg != null && !isInCycle) m.edit({ embed: embed });
         if (
            typeof m.reactions == "undefined" ||
            !m.reactions.cache.some(x =>
               this.emojis.map(e => e.emoji).includes(x.emoji)
            )
         )
            for (let e of this.emojis) m.react(e.emoji).catch(reject);
         if (data.white_check_mark == true) m.react(`✅`).catch(reject);
         let collector = new head.modules.Discord.ReactionCollector(
            m,
            (r, u) =>
               (data.white_check_mark == true
                  ? this.emojis.some(x => x.emoji == r.emoji.name) ||
                    r.emoji.name == "✅"
                  : this.emojis.some(x => x.emoji == r.emoji.name)) &&
               u.id == message.author.id,
            {}
         );
         collector.on("collect", async (r, u) => {
            collector.stop();
            if (data.white_check_mark == true)
               m.reactions.removeAll().catch(reject);
            else r.users.remove(u);
            return resolve({
               category:
                  r.emoji.name == "✅"
                     ? true
                     : this.emojis.find(x => x.emoji == r.emoji.name),
               msg: m
            });
         });
      });
   }

   async confirmedSetup(head, client, message, channel, msg) {
      let embed_description = `**⠀**\nUsing the reactions below, please review your setup. The reactions on this message will be automatically cleared in 3 minutes.\n**⠀**`;
      let embed = {
         title: `You have confirmed the setup:`,
         fields: [],
         timestamp: new Date(),
         description: embed_description,
         color: message.guild.me.displayHexColor
      };
      let on = true;
      setTimeout(() => {
         on = false;
         msg.reactions.removeAll();
         embed.description = null;
         embed.fields = [];
         for (let o of this.emojis) {
            let obj = {
               name: `**${o.continent
                  .split("-")
                  .map(s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
                  .join(` `)}**`,
               value: "",
               inline: true
            };
            for (let x of this.emojis.find(x => x == o).data) {
               obj.value = obj.value.concat(
                  `${
                     x.country.length == 2
                        ? x.country.toUpperCase()
                        : x.country
                             .split("-")
                             .map(
                                s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`
                             )
                             .join(` `)
                  }: ${
                     channel[x.country] == "none" ? `:x:` : `:white_check_mark:`
                  }\n`
               );
            }
            embed.fields.push(obj);
            continue;
         }
         msg.edit({
            embed: embed
         });
      }, 180000);
      this.finishSetup(head, client, message, channel);
      let edited = 0;
      while (on == true) {
         let category = (
            await this.getCategory(head, message, embed, {
               msg: msg,
               white_check_mark: false,
               channel: channel,
               cycle: edited == 0 ? false : true
            })
         ).category;
         edited++;
         embed.fields = [];
         embed.description = embed_description;
         // @ts-ignore
         if (on == false) return;
         this.getChannel(head, message, embed, {
            msg: msg,
            white_check_mark: false,
            channel: channel,
            category: category
         });
         continue;
      }
   }

   async finishSetup(head, client, message, channel) {
      head.models.guilds.findOne(
         {
            guild_id: message.guild.id
         },
         (err, db) => {
            if (err) return head.error(err);
            if (db.setup == false) db.setup = true;
            db.save(err => {
               if (err) return head.error(err);
            });
         }
      );
      for (let c of Object.keys(channel)) {
         if (channel[c] == "none") continue;
         let ch = message.guild.channels.cache.get(channel[c]);
         if (!ch) continue;
         ch.setName(
            `${
               c == "global"
                  ? `COVID-19 Cases: ${head.functions.addCommasToNo(
                       await head.functions.getCases(head, client)
                    )}`
                  : `${
                       c.length == 2
                          ? c.toUpperCase()
                          : c
                               .split("-")
                               .map(
                                  s =>
                                     `${s.charAt(0).toUpperCase()}${s.slice(1)}`
                               )
                               .join(` `)
                    }: ${head.functions.addCommasToNo(
                       await head.functions.getCases(head, client, c)
                    )}`
            }`
         );
      }
      head.functions.getLogChannel(head, client).then(logch => {
         let e = {
            color: message.guild.me.displayHexColor,
            title: `**Guild Successfully Setup:**`,
            description: `**⠀**\nGuild: ${message.guild.name} *(${message.guild.id})*\n**⠀**`,
            thumbnail: {
               url: message.guild.iconURL()
            },
            timestamp: new Date(),
            fields: []
         };
         for (let o of this.emojis) {
            let obj = {
               name: `**${o.continent
                  .split("-")
                  .map(s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
                  .join(` `)}**`,
               value: "",
               inline: true
            };
            for (let x of this.emojis.find(x => x == o).data) {
               obj.value = obj.value.concat(
                  `**${
                     x.country.length == 2
                        ? x.country.toUpperCase()
                        : x.country
                             .split("-")
                             .map(
                                s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`
                             )
                             .join(` `)
                  }**: ${
                     channel[x.country] == "none"
                        ? `Disabled`
                        : channel[x.country].name
                  }\n`
               );
            }
            e.fields.push(obj);
            continue;
         }
         logch.send({ embed: e });
      });
   }

   init(head, client, message, channel, m = null) {
      return new Promise(async (resolve, reject) => {
         head.log(`got at init()`);
         // category
         /* returns {
            category: category (obj),
            msg: msg
         }*/
         let embed = {
            title: "Edit your setup:",
            description: `**⠀**\nIf you are happy with this setup, please select :white_check_mark:\nIf you wish to edit any of your inputs, please select below with the corresponding reactions.\n**⠀**`,
            fields: []
         };
         const categoryAndMsg = await this.getCategory(head, message, embed, {
            msg: m,
            white_check_mark: true,
            channel: channel
         }).catch(err => reject(err));
         const category = categoryAndMsg.category;
         const msg = categoryAndMsg.msg;
         if (category == true) {
            this.confirmedSetup(head, client, message, channel, msg).catch(
               reject
            );
            resolve();
            return;
         }

         // get selected channel
         embed.fields = [];
         const vcChannel = await this.getChannel(head, message, embed, {
            msg: msg,
            white_check_mark: true,
            channel: channel,
            category: category
         }).catch(reject);
         if (vcChannel == true) {
            resolve();
            return this.init(head, client, message, channel, msg).catch(reject);
         }

         // set selected channel
         const ch = await this.getVC(head, message, vcChannel, {
            in_setup: true,
            channel: channel,
            msg: msg
         });
         channel[vcChannel] = ch;
         await this.setInVCDatabase(
            head,
            message.guild.id,
            vcChannel,
            ch.id
         ).catch(reject);
         this.init(head, client, message, channel, msg).catch(reject);
         return resolve();
      });
   }

   setInVCDatabase(head, guild_id, country, channel) {
      return new Promise((resolve, reject) => {
         head.models.voice_channels.findOne(
            {
               guild_id: typeof guild_id == "string" ? guild_id : guild_id.id
            },
            (err, db) => {
               if (err) return reject(err);
               if (!db)
                  return reject(
                     `No database for ${
                        typeof guild_id == "string" ? guild_id : guild_id.id
                     } in setup.js setInVCDatabase()`
                  );
               db[country] = channel;
               db.save(err => {
                  if (err) return reject(err);
                  else return resolve();
               });
            }
         );
      });
   }

   getVC(head, message, country, data) {
      return new Promise((resolve, reject) => {
         data.msg.react("❌");
         data.msg.edit(
            new head.modules.Discord.MessageEmbed()
               .setColor(message.guild.me.displayHexColor)
               .setTitle(`Setting up **automatic voice channel updates**...`)
               .setDescription(
                  `**⠀**\nWhat voice channel should I update ${country
                     .split("-")
                     .map(s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
                     .join(
                        ` `
                     )} COVID-19 cases with?\n**⠀**\n**You can:**\n- Paste the ID of the channel\n- Type the name of the channel\n- React with :x: to disable this module`
               )
         );
         let mc = new head.modules.Discord.MessageCollector(
            data.msg.channel,
            m => m.author.id == message.author.id,
            {}
         );
         let rc = new head.modules.Discord.ReactionCollector(
            data.msg,
            (r, u) => r.emoji.name == "❌" && u.id == message.author.id,
            { max: 1 }
         );
         mc.on("collect", async m => {
            data.msg.reactions.removeAll();
            m.delete();
            let channel =
               m.guild.channels.cache.get(m.content) ||
               m.guild.channels.cache.find(x => x.name == m.content);
            if (!channel || channel.type !== "voice")
               return data.msg
                  .edit(`:x: This channel is not valid. Please try again.`)
                  .then(() => setTimeout(() => data.msg.edit(`** **`), 2500));
            if (Object.values(data.channel).includes(channel.id))
               return data.msg
                  .edit(
                     `:x: You cannot assign one voice channel to multiple voice channel updates! Please try again.`
                  )
                  .then(() => setTimeout(() => data.msg.edit(`** **`), 2500));
            mc.stop();
            rc.stop();
            return resolve(channel);
         });
         rc.on("collect", async (r, u) => {
            data.msg.reactions.removeAll();
            mc.stop();
            rc.stop();
            return resolve("none");
         });
      });
   }

   getChannel(head, message, em, data) {
      return new Promise(async (resolve, reject) => {
         let embed = em;
         embed.description = `**⠀**\nContinent: **${data.category.continent
            .charAt(0)
            .toUpperCase()}${data.category.continent.slice(1)}**\n${
            em.description
         }`;
         for (let o of data.category.data) {
            embed.fields.push({
               name: `${data.white_check_mark == true ? `${o.emoji} ` : ``}**${
                  o.country.length == 2
                     ? o.country.toUpperCase()
                     : o.country
                          .split("-")
                          .map(s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
                          .join(` `)
               }**:`,
               value:
                  data.channel[o.country] == "none"
                     ? `Disabled`
                     : `${data.channel[o.country].name}\n*${
                          data.channel[o.country].id
                       }*`,
               inline: true
            });
         }
         data.msg.edit({ embed: embed }).catch(reject);
         if (data.white_check_mark == false) return resolve();
         for (let e of this.emojis.find(x => x == data.category).data)
            data.msg.react(e.emoji);
         if (data.white_check_mark == true) data.msg.react("✅");
         let collector = new head.modules.Discord.ReactionCollector(
            data.msg,
            (r, u) =>
               data.white_check_mark == true
                  ? (data.category.data.some(x => x.emoji == r.emoji.name) ||
                       r.emoji.name == "✅") &&
                    u.id == message.author.id
                  : data.category.data.some(x => x.emoji == r.emoji.name) &&
                    u.id == message.author.id,
            { max: 1 }
         );
         collector.on("collect", async (r, u) => {
            head.log(`collected`);
            await data.msg.reactions.removeAll();
            if (r.emoji.name == "✅") return resolve(true);
            return resolve(
               data.category.data.find(x => x.emoji == r.emoji.name).country
            );
         });
      });
   }

   async run(head, client, message, args) {
      head.log(`got at beginning of run()`);
      if (!message.member.hasPermission("ADMINISTRATOR"))
         return message.channel.send(
            `:x: You do not have permission to run this command in this guild.`
         );
      if (
         (await head.functions.guildIsSetup(head, client, message.guild.id)) ==
         false
      ) {
         await new Promise((resolve, reject) => {
            head.models.voice_channels.findOne(
               {
                  guild_id: message.guild.id
               },
               (err, db) => {
                  if (err) return reject(err);
                  if (!db) {
                     let newdb = new head.models.voice_channels({
                        guild_id: message.guild.id
                     });
                     newdb.save(err => {
                        if (err) return reject(err);
                        else return resolve();
                     });
                  } else resolve();
               }
            );
         }).catch(err => head.error(err));
         head.models.guilds.findOne(
            {
               guild_id: message.guild.id
            },
            async (err, db) => {
               if (err) return head.error(err);
               if (!db) {
                  await new Promise((resolve, reject) => {
                     let newdb = new head.models.guilds({
                        guild_id: message.guild.id,
                        setup: true
                     });
                     newdb.save(err => {
                        if (err) return reject(err);
                        else return resolve();
                     });
                  }).catch(head.error);
                  return;
               }
               db.setup = true;
               db.save(err => {
                  if (err) return head.error(err);
               });
            }
         );
      }
      // channel object
      let channel = await this.getChannels(head, client, message).catch(err =>
         head.error(err)
      );

      this.init(head, client, message, channel).catch(head.error);
   }
};
