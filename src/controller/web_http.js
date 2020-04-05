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
         this.head.post(
            res instanceof Object ? JSON.stringify(res) : String(res)
         );
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

class botsgg {
   constructor(head, client) {
      this.head = head;
      this.client = client;
      this.init().catch((err) => head.error(err));
      setInterval(() => {
         this.init().catch((err) => head.error(err));
      }, 180000);
   }

   guildCount() {
      return new Promise(async (resolve, reject) => {
         const res = await this.head.modules.axios
            .post(
               `https://discord.bots.gg/api/v1/bots/${this.client.user.id}/stats`,
               {
                  guildCount: this.client.guilds.cache.array().length,
                  shardCount: 1,
               },
               {
                  headers: {
                     Authorization: this.head.auth.botsgg_key,
                     "Content-Type": "application/json",
                  },
               }
            )
            .catch((err) => reject(err));
         resolve();
         this.head.log(`bots.gg response: ${res.statusCode}`);
         this.head.post(
            res instanceof Object ? JSON.stringify(res) : String(res)
         );
      });
   }

   init() {
      return new Promise(async (resolve, reject) => {
         await this.guildCount().catch((err) => reject(err));
         return resolve();
      });
   }
}

class discordbotlist {
   constructor(head, client) {
      this.head = head;
      this.client = client;
      this.init().catch((err) => head.error(err));
      setInterval(() => this.init().catch((err) => head.error(err)), 180000);
   }

   data() {
      return new Promise(async (resolve, reject) => {
         let users = 0;
         for (let guild of this.client.guilds.cache.array()) {
            users += guild.memberCount;
         }
         const res = await this.head.modules.axios
            .post(
               `https://discordbotlist.com/api/bots/${this.client.user.id}/stats`,
               {
                  guilds: this.client.guilds.cache.array().length,
                  users: users,
               },
               {
                  headers: {
                     Authorization: this.head.auth.dbl_key,
                  },
               }
            )
            .catch((err) => reject(err));
         resolve();
         this.head.log(`discordbotlist.com response: ${res.statusCode}`);
         this.head.post(
            res instanceof Object ? JSON.stringify(res) : String(res)
         );
         return;
      });
   }

   init() {
      return new Promise(async (resolve, reject) => {
         await this.data().catch((err) => reject(err));
         return resolve();
      });
   }
}

class divinediscordbots {
   constructor(head, client) {
      this.head = head;
      this.client = client;
      this.init().catch((err) => head.error(err));
      setInterval(() => {
         this.init().catch((err) => head.error(err));
      }, 180000);
   }

   server_count() {
      return new Promise(async (resolve, reject) => {
         const res = await this.head.modules.ddbl.postStats(
            Number(this.client.guilds.cache.array().length)
         );
         this.head.log(`Response from divinediscordbots: ${res}`);
         return resolve();
      });
   }

   init() {
      return new Promise(async (resolve, reject) => {
         await this.server_count().catch((err) => reject(err));
         return resolve();
      });
   }
}

module.exports = (head, client) => {
   return new Promise((resolve, reject) => {
      new botsondiscord(head, client);
      new divinediscordbots(head, client);
      new botsgg(head, client);
      new discordbotlist(head, client);
      return resolve();
   });
};
