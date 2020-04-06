module.exports = (head, region) => {
   return new Promise((resolve, reject) => {
      head.models.graphs.findOne(
         {
            region: region,
         },
         (err, db) => {
            if (err) return reject(err);
            if (!db) return resolve("none");
            return resolve(db.url);
         }
      );
   });
};
