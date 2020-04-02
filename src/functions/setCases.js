module.exports = (head, client, country = null) => {
   return new Promise(async (resolve, reject) => {
      if (country == "global") country = null;
      try {
         const result = await head.modules.request({
            uri: `https://www.worldometers.info/coronavirus/${
               country == null ? `` : `country/${country}/`
            }`,
            json: true
         });
         let json = await head.modules.himalaya.parse(result);
         let str = JSON.stringify(
            json[9]["children"][5]["children"][17]["children"][3][
               "children"
            ][1]["children"][1]["children"][country == null ? 13 : 11][
               "children"
            ][3]["children"][1]["children"][0]["content"]
         );
         let string = String(str)
            .replace(",", "")
            .replace(",", "")
            .replace(`"`, "")
            .replace(`"`, "");
         let cases = parseInt(string);
         head.cases[country == null ? "global" : country] = cases;
         return resolve();
      } catch (e) {
         return reject(`Country: ${country} =>` + e.stack);
      }
   });
};
