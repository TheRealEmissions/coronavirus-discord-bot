module.exports = class {
   constructor() {
      this.name = "info";
      this.alias = [];
      this.usage = "";
   }

   async run(head, client, message, args) {
      const result = await head.modules.request({
         uri: `https://www.worldometers.info/coronavirus/`,
         json: true
      });
      let json = await head.modules.himalaya.parse(result);
      let deaths = Number(
         JSON.stringify(
            json[9]["children"][3]["children"][7]["children"][0]["content"]
         )
            .split("and ")[1]
            .split(" ")[0]
            .replace(",", "")
      );
      let recovered = Number(
         JSON.stringify(
            json[9]["children"][5]["children"][17]["children"][3][
               "children"
            ][1]["children"][1]["children"][19]["children"][3]["children"][1][
               "children"
            ][0]["content"]
         )
            .replace(`"`, "")
            .replace(`"`, "")
            .replace(`,`, "")
      );
      const image_url = await new Promise((resolve, reject) => {
         head.models.graphs.findOne(
            {
               region: "global"
            },
            (err, db) => {
               if (err) return reject(err);
               return resolve(db.other_url);
            }
         );
      }).catch(err => head.error(err));
      message.channel.send(
         new head.modules.Discord.MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`**COVID-19 Information:**`)
            .setDescription(
               `**⠀**\n🦠 **Confirmed Cases:** ${head.functions.addCommasToNo(
                  await head.functions.getCases(head, client)
               )}\n💀 **Deaths:** ${head.functions.addCommasToNo(
                  deaths
               )}\n🤸 **Recoveries:** ${head.functions.addCommasToNo(
                  recovered
               )}`
            )
            .setImage(image_url == "none" ? null : `${image_url}.png`)
      );
   }
};
