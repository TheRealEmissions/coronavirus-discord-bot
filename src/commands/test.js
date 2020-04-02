module.exports = class {
   constructor() {
      this.name = "test";
      this.alias = [];
      this.usage = "";
   }

   async run(head, client, message, args) {
      if (message.author.id != "201095756784992256") return;
      const result = await head.modules.request({
         uri: `https://www.worldometers.info/coronavirus/country/uk`,
         json: true
      });
      let json = await head.modules.himalaya.parse(result);
      head.modules.fs.appendFile(`./result.txt`, JSON.stringify(json), err =>
         head.error(err)
      );
   }
};
