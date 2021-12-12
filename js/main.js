let scatterVis;
let sankeyVis;
let compareVis;
let imperfectionVis;

let csv = "/levallois-core-project/core-data.csv"

// read csv data from data folder
d3.csv(csv).then(csvData => {
    console.log(csvData)
    createVis(csvData)
});


function createVis(data){

    scatterVis = new ScatterVis("#scatterVis", data);
    sankeyVis = new SankeyVis("#sankeyVis", data);
    compareVis = new CompareVis("#compareVis", data)
    imperfectionVis = new ImperfectionVis("imperfectionVis", data);
}