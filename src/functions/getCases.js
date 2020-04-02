module.exports = (head, client, country = null) => {
   return new Promise(async (resolve, reject) => {
      let cases = head.cases[country == null ? "global" : country];
      return resolve(cases);
   });
};
