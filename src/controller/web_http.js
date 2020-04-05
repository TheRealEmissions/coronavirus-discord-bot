class botsondiscord {
   constructor(head, client) {
      this.head = head;
      this.client = client;
      this.init().catch((err) => head.error(err));
      setInterval(() => {
         this.init().catch((err) => head.error(err));
      }, 300000);
   }

   guildCount() {
      return new Promise(async (resolve, reject) => {
         const res = await this.head.modules.axios
            .post(
               `https://bots.ondiscord.xyz/bot-api/bots/${this.client.user.id}/guilds`,
               {
                  guildCount: this.client.guilds.cache.array().length,
               },
               {
                  headers: {
                     Authorization: this.head.auth.bod_api_key,
                     "Content-Type": "application/json",
                  },
               }
            )
            .catch((err) => reject(err));
         resolve();
         this.head.log(`bots.ondiscord.xyz response: ${res.statusCode}`);
         this.head.post(JSON.stringify(res));
         return;
      });
   }

   init() {
      return new Promise(async (resolve, reject) => {
         await this.guildCount().catch((err) => reject(err));
         return resolve();
      });
   }
}

module.exports = (head, client) => {
   return new Promise((resolve, reject) => {
      new botsondiscord(head, client);
   });
};
