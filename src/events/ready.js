module.exports = (head, client) => {
   setTimeout(async () => {
      client.user.setPresence({
         activity: {
            name: `${head.functions.addCommasToNo(
               await head.functions.getCases(head, client)
            )} COVID-19 Cases || .help`
         },
         status: "online"
      });
   }, 10000);
   setInterval(async () => {
      client.user.setPresence({
         activity: {
            name: `${head.functions.addCommasToNo(
               await head.functions.getCases(head, client)
            )} COVID-19 Cases || .help`
         },
         status: "online"
      });
   }, 60000);
   head.log(`Logged into Discord`);
};
