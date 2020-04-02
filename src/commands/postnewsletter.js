module.exports = class {
   constructor() {
      this.name = "postnewsletter";
      this.alias = ["postnl"];
      this.usage = "";
   }

   async run(head, client, message, args) {
      if (message.author.id != "201095756784992256") return;
      const ids = await new Promise((resolve, reject) => {
         head.models.newsletters
            .find({})
            .lean()
            .exec((err, docs) => {
               if (err) return reject(err);
               let arr = [];
               for (let doc of docs) {
                  arr.push(doc.user_id);
               }
               return resolve(arr);
            });
      }).catch(err => head.error(err));
      let done = 0;
      for (let id of ids) {
         let user = await client.users.fetch(id);
         await new Promise(async (resolve, reject) => {
            user
               .send(
                  new head.modules.Discord.MessageEmbed()
                     .setColor(message.guild.me.displayHexColor)
                     .setTitle(`**Newsletter:**`)
                     .setDescription(
                        `**⠀**\n${message.content.slice(
                           args[0].length + 1
                        )}\n**⠀**\n- [The Hideout Community](https://hideout.community/discord)`
                     )
                     .setFooter(
                        `Wish to opt out of this service? Reply with .newsletter`
                     )
                     .setTimestamp()
               )
               .then(() => {
                  return resolve(true);
               })
               .catch(e => {
                  return resolve(e);
               });
         }).then(res => {
            if (res != true) {
               head.error(res);
               head.models.newsletters.deleteOne(
                  {
                     user_id: id
                  },
                  err => {
                     if (err) return head.error(err);
                  }
               );
            } else done += 1;
         });
      }
      message.channel.send(
         `Pushed newsletter to ${done} users. :white_check_mark:`
      );
   }
};
