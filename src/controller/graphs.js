function calculateGrowths(head, country) {
   return new Promise((resolve, reject) => {
      if (country == null) country = "global";
      let cases = head.covid[country].cases;
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
         newcases: newcases
      });
   });
}

function generateGraph(head, country) {
   return new Promise(async (resolve, reject) => {
      let a = await calculateGrowths(head, country);
      let growths = a.growths;
      let newcases = a.newcases;
      let xaxis = [];
      for (let c in head.covid[country].cases) xaxis.push(Number(c) + 1);
      let graph = {
         data: [
            {
               x: xaxis,
               y: [...newcases],
               type: "bar",
               name: "Daily Cases of COVID-19",
               xaxis: "x"
            },
            {
               x: xaxis,
               y: [...growths],
               type: "scatter",
               name: "Daily Growth of COVID-19",
               yaxis: "y2",
               xaxis: "x"
            }
         ],
         options: {
            filename: `${new Date().getTime()}-${country}`,
            fileopt: "overwrite",
            layout: {
               title: "COVID-19",
               xaxis: {
                  title: "Days (arbitrary)"
               },
               yaxis: {
                  title: "Cases of COVID-19",
                  autorange: false,
                  range: head.covid[country].graph_range.y1
               },
               yaxis2: {
                  title: "Growth of COVID-19",
                  yaxis: "y2",
                  side: "right",
                  overlaying: "y",
                  autorange: false,
                  range: head.covid[country].graph_range.y2
               }
            }
         }
      };
      let graph_url = await new Promise((resolve, reject) => {
         head.modules.plotly.plot(graph.data, graph.options, (err, msg) => {
            if (err) return reject(err);
            else return resolve(msg);
         });
      });
      return resolve(graph_url.url);
   });
}

function init(head, client) {
   return new Promise(async (resolve, reject) => {
      for (let region of Object.keys(head.covid)) {
         head.models.graphs.findOne(
            {
               region: region
            },
            async (err, db) => {
               if (err) return reject(err);
               if (!db) {
                  const url = await generateGraph(head, region);
                  let newdb = new head.models.graphs({
                     region: region,
                     url: url,
                     update_timestamp: new Date()
                  });
                  newdb.save(err => {
                     if (err) return reject(err);
                     else return;
                  });
                  return;
               }
               if (
                  new Date().getTime() -
                     new Date(db.update_timestamp).getTime() >=
                     86400000 ||
                  db.url == "none"
               ) {
                  const url = await generateGraph(head, region);
                  db.url = url;
                  db.update_timestamp = new Date();
                  db.save(err => {
                     if (err) return reject(err);
                     else return;
                  });
               }
               return;
            }
         );
      }
      return resolve();
   });
}

function initOther(head, client) {
   return new Promise((resolve, reject) => {
      head.models.graphs.findOne(
         {
            region: "global"
         },
         async (err, db) => {
            if (err) return reject(err);
            if (
               new Date().getTime() - new Date(db.update_timestamp).getTime() <
               86400000
            )
               return;
            if (db.other_url == "none") {
               let xaxis = [];
               for (let c in head.covid.global.cases) xaxis.push(Number(c) + 1);
               let graph = {
                  data: [
                     {
                        x: xaxis,
                        y: head.covid.global.cases,
                        type: "bar",
                        name: "Total Cases",
                        xaxis: "x"
                     },
                     {
                        x: xaxis,
                        y: head.covid.global.deaths,
                        type: "bar",
                        name: "Total Deaths",
                        yaxis: "y2",
                        xaxis: "x"
                     },
                     {
                        x: xaxis,
                        y: head.covid.global.recovered,
                        type: "scatter",
                        name: "Total Recovered",
                        yaxis: "y3",
                        xaxis: "x"
                     }
                  ],
                  options: {
                     filename: `${new Date().getTime()}-globalother`,
                     fileopt: "overwrite",
                     layout: {
                        title: "COVID-19",
                        xaxis: {
                           title: "Days (arbitrary)"
                        },
                        yaxis: {
                           title: "Total Cases",
                           autorange: false,
                           range: [0, 500000]
                        },
                        yaxis2: {
                           title: "Total Deaths",
                           yaxis: "y2",
                           side: "right",
                           overlaying: "y",
                           autorange: false,
                           range: [0, 50000]
                        },
                        yaxis3: {
                           title: "Total Recoveries",
                           yaxis: "y3",
                           side: "left",
                           anchor: "free",
                           position: 0.15,
                           overlaying: "y",
                           autorange: false,
                           range: [0, 500000]
                        }
                     }
                  }
               };
               let graph_url = await new Promise((resolve, reject) => {
                  head.modules.plotly.plot(
                     graph.data,
                     graph.options,
                     (err, msg) => {
                        if (err) return reject(err);
                        else return resolve(msg);
                     }
                  );
               });
               db.other_url = graph_url.url;
               db.save(err => {
                  if (err) return reject(err);
                  else return resolve();
               });
            } else return resolve();
         }
      );
      return resolve();
   });
}

module.exports = (head, client) => {
   return new Promise(async (resolve, reject) => {
      console.time("graphs");
      await Promise.all([
         init(head, client).catch(reject),
         initOther(head, client).catch(reject)
      ]);
      setInterval(() => {
         init(head, client).catch(err => reject(err));
         initOther(head, client).catch(err => reject(err));
      }, 3600000);
      console.timeEnd("graphs");
      return resolve();
   });
};
