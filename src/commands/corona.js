module.exports = class {
   constructor() {
      this.name = "corona";
      this.alias = ["covid"];
      this.usage = "";
   }

   numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }

   calculateGrowths(head, country) {
      return new Promise((resolve, reject) => {
         let cases = head.covid[`${country}`].cases;
         let growths = [];
         let newcases = [];
         for (let n in cases) {
            let index = Number(n);
            if (index == 0 || index == 1) {
               growths.push(0);
               newcases.push(0);
               continue;
            }
            let today = cases[index] - cases[index - 1];
            newcases.push(today);
            let yesterday = cases[index - 1] - cases[index - 2];
            let growth = today / yesterday;
            if (isNaN(growth) || !isFinite(growth)) growth = 0;
            growths.push(growth);
         }
         return resolve({
            growths: growths,
            newcases: newcases,
         });
      });
   }

   async run(head, client, message, args) {
      if (!args[1]) {
         let a = await this.calculateGrowths(head, "global");
         let growths = a.growths;
         let total = 0;
         for (let n of growths) total += Number(n);
         let growth = Number(total) / Number(growths.length);
         let current = await head.functions.getCases(head, client, null);
         let predicted = head.covid.global.predicted;
         let previous =
            head.covid.global.cases[head.covid.global.cases.length - 1];
         let pgrowth =
            (current - previous) /
            (previous -
               head.covid.global.cases[head.covid.global.cases.length - 2]);
         let array = [current];
         let origcases =
            head.covid.global.cases[head.covid.global.cases.length - 1];
         let prevcases =
            head.covid.global.cases[head.covid.global.cases.length - 2];
         let c = origcases - prevcases;
         let cpredict = c * growth;
         array.push(
            parseFloat((array[array.length - 1] + cpredict).toFixed(0))
         );
         for (let i = 1; i < 14; i++) {
            let origcases = array[array.length - 1];
            let prevcases = array[array.length - 2];
            let c = origcases - prevcases;
            let cpredict = c * growth;
            array.push(
               parseFloat((array[array.length - 1] + cpredict).toFixed(0))
            );
         }
         let graph_url = await head.functions.getGraph(head, "global");
         if (graph_url == "none") graph_url = null;
         let embed = {
            embed: {
               color: message.guild.me.displayHexColor,
               title: "Coronavirus Information - Global",
               description: `**⠀**\nUpvote me: [HERE](https://discordbotlist.com/bots/691330203036811335) [HERE](https://bots.ondiscord.xyz/bots/691330203036811335) [HERE](https://divinediscordbots.com/bot/691330203036811335) [HERE](https://discord.bots.gg/bots/691330203036811335)\n**⠀**\n📊 **Average Growth:** \`${growth.toFixed(
                  2
               )}\` or \`${(growth * 100).toFixed(
                  2
               )}%\`\n📈 **Growth today:** \`${pgrowth.toFixed(2)}\` or \`${(
                  pgrowth * 100
               ).toFixed(
                  2
               )}%\`\n:microbe: **Prediction for today:** \`${this.numberWithCommas(
                  predicted
               )}\` *(${
                  current > predicted ? `underestimate` : `overestimate`
               })*\n**⠀**`,
               fields: [
                  {
                     name: "Day:",
                     value: "",
                     inline: true,
                  },
                  {
                     name: "Prediction:",
                     value: "",
                     inline: true,
                  },
               ],
               image: {
                  url: graph_url == null ? null : `${graph_url}.png`,
               },
            },
         };
         for (const e in array) {
            embed.embed.fields.find(
               (x) => x.name == "Day:"
            ).value = embed.embed.fields
               .find((x) => x.name == "Day:")
               .value.concat(
                  `${Number(e) + 1 == 1 ? `1 *(today)*` : Number(e) + 1}\n`
               );
            embed.embed.fields.find(
               (x) => x.name == "Prediction:"
            ).value = embed.embed.fields
               .find((x) => x.name == "Prediction:")
               .value.concat(`${this.numberWithCommas(String(array[e]))}\n`);
         }
         message.channel.send(embed);
      } else {
         if (
            !head.covid[`${args[1].toLowerCase()}`] ||
            typeof head.covid[`${args[1].toLowerCase()}`] == "undefined"
         )
            return;
         let a = await this.calculateGrowths(head, args[1].toLowerCase());
         let growths = a.growths;
         let total = 0;
         for (let n of growths) total += Number(n);
         let growth = Number(total) / Number(growths.length);
         let current = await head.functions.getCases(
            head,
            client,
            args[1].toLowerCase()
         );
         let predicted = head.covid[`${args[1].toLowerCase()}`].predicted;
         let previous =
            head.covid[`${args[1].toLowerCase()}`].cases[
               head.covid[`${args[1].toLowerCase()}`].cases.length - 1
            ];
         let pgrowth =
            (current - previous) /
            (previous -
               head.covid[`${args[1].toLowerCase()}`].cases[
                  head.covid[`${args[1].toLowerCase()}`].cases.length - 2
               ]);
         let array = [current];
         let origcases =
            head.covid[`${args[1].toLowerCase()}`].cases[
               head.covid[`${args[1].toLowerCase()}`].cases.length - 1
            ];
         let prevcases =
            head.covid[`${args[1].toLowerCase()}`].cases[
               head.covid[`${args[1].toLowerCase()}`].cases.length - 2
            ];
         let c = origcases - prevcases;
         let cpredict = c * growth;
         array.push(
            parseFloat((array[array.length - 1] + cpredict).toFixed(0))
         );
         for (let i = 1; i < 14; i++) {
            let origcases = array[array.length - 1];
            let prevcases = array[array.length - 2];
            let c = origcases - prevcases;
            let cpredict = c * growth;
            array.push(
               parseFloat((array[array.length - 1] + cpredict).toFixed(0))
            );
         }
         let graph_url = await head.functions.getGraph(
            head,
            args[1].toLowerCase()
         );
         if (graph_url == "none") graph_url = null;
         let embed = {
            embed: {
               color: message.guild.me.displayHexColor,
               title: `Coronavirus Information - ${
                  args[1].length == 2
                     ? args[1].toUpperCase()
                     : args[1]
                          .split("-")
                          .map(
                             (s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`
                          )
                          .join(` `)
               }`,
               description: `**⠀**\nUpvote me: [HERE](https://discordbotlist.com/bots/691330203036811335) [HERE](https://bots.ondiscord.xyz/bots/691330203036811335) [HERE](https://divinediscordbots.com/bot/691330203036811335) [HERE](https://discord.bots.gg/bots/691330203036811335)\n**⠀**\n📊 **Average Growth:** \`${growth.toFixed(
                  2
               )}\` or \`${(growth * 100).toFixed(
                  2
               )}%\`\n📈 **Growth today:** \`${pgrowth.toFixed(2)}\` or \`${(
                  pgrowth * 100
               ).toFixed(
                  2
               )}%\`\n:microbe: **Prediction for today:** \`${this.numberWithCommas(
                  predicted
               )}\` *(${
                  current > predicted ? `underestimate` : `overestimate`
               })*\n**⠀**`,
               fields: [
                  {
                     name: "Day:",
                     value: "",
                     inline: true,
                  },
                  {
                     name: "Prediction:",
                     value: "",
                     inline: true,
                  },
               ],
               image: {
                  url: graph_url == null ? null : `${graph_url}.png`,
               },
            },
         };
         for (const e in array) {
            embed.embed.fields.find(
               (x) => x.name == "Day:"
            ).value = embed.embed.fields
               .find((x) => x.name == "Day:")
               .value.concat(
                  `${Number(e) + 1 == 1 ? `1 *(today)*` : Number(e) + 1}\n`
               );
            embed.embed.fields.find(
               (x) => x.name == "Prediction:"
            ).value = embed.embed.fields
               .find((x) => x.name == "Prediction:")
               .value.concat(`${this.numberWithCommas(String(array[e]))}\n`);
         }
         message.channel.send(embed);
      }
   }
};
