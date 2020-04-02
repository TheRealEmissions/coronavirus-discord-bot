async function cases(head, client) {
   let countries = [...Object.keys(head.covid)];
   await Promise.all(
      countries.map(c => head.functions.setCases(head, client, c))
   );
}

module.exports = (head, client) => {
   return new Promise(async (resolve, reject) => {
      console.time("cases");
      await cases(head, client).catch(err => reject(err));
      setInterval(() => cases(head, client).catch(err => reject(err)), 30000);
      resolve();
      console.timeEnd("cases");
      return;
   });
};
