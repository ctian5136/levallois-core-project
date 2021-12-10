let scatterVis;
let sankeyVis;


let csv = "../data/core-data.csv"

// read csv data from data folder
d3.csv(csv).then(csvData => {
    console.log(csvData)
    createVis(csvData)
});


function createVis(data){

    scatterVis = new ScatterVis("#scatterVis", data);
    sankeyVis = new SankeyVis("#sankeyVis", data);


}