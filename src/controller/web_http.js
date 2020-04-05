class botsondiscord {
   constructor(head, client) {
      this.head = head;
      this.client = client;
      this.init();
   }

   guildCount() {
      return new Promise(async (resolve, reject) => {
         const res = await this.head.modules.axios
            .post(
               `https://bots.ondiscord.xyz/bot-api/bots/${this.head.auth.bod_api_key}/guilds`,
               {
                  guildCount: this.client.guilds.cache.array().length,
               }
            )
            .catch((err) => this.head.error(err));
         this.head.log(`bots.ondiscord.xyz response: ${res.statusCode}`);
         this.head.post(res);
      });
   }

   init() {
      return new Promise(async (resolve, reject) => {
         await this.guildCount();
      });
   }
}

module.exports = (head, client) => {
   return new Promise((resolve, reject) => {
      new botsondiscord(head, client);
   });
};
