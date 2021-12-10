/* * * * * * * * * * * * * *
*     class SankeyVis      *
* * * * * * * * * * * * * */


class SankeyVis {
    constructor(parentElement, _data) {
        this.parentElement = parentElement;
        this.data = _data;
        this.displayData = [];

        this.initVis()
    }

    groupBy(arr, criteria) {
        let newObj = arr.reduce(function (acc, currentValue) {
            if (!acc[currentValue[criteria]]) {
                acc[currentValue[criteria]] = [];
            }
            acc[currentValue[criteria]].push(currentValue);
            return acc;
        }, {});
        return newObj;
    }

    initVis() {
        let vis = this;

        // group by layer
        vis.layerGroup = this.groupBy(vis.data, "layer");

        // group by imperfections by layer
        vis.imperfectionsB = this.groupBy(vis.layerGroup["b"], "imperfections");
        vis.imperfectionsB1 = this.groupBy(vis.layerGroup["b1"], "imperfections");
        vis.imperfectionsB1n = this.groupBy(vis.layerGroup["b1n"], "imperfections");
        vis.imperfectionsB1m = this.groupBy(vis.layerGroup["b1m"], "imperfections");
        vis.imperfectionsB2 = this.groupBy(vis.layerGroup["b2"], "imperfections");

        console.log(vis.layerGroup);

        vis.CLEANimperfectionsB = {}
        vis.CLEANimperfectionsB1 = {}
        vis.CLEANimperfectionsB1n = {}
        vis.CLEANimperfectionsB1m = {}
        vis.CLEANimperfectionsB2 = {}

        vis.y = []
        vis.n = []

        // cleaning for y/n imperfections
        for (let attr in vis.imperfectionsB) {
            if (vis.imperfectionsB[attr].length > 1) {
                vis.CLEANimperfectionsB[attr] = vis.imperfectionsB[attr];
                for (let i = 0; i < vis.imperfectionsB[attr].length; i++) {
                    vis[attr].push(vis.imperfectionsB[attr][i]);
                }
            }
        }
        for (let attr in vis.imperfectionsB1) {
            if (vis.imperfectionsB1[attr].length > 1) {
                vis.CLEANimperfectionsB1[attr] = vis.imperfectionsB1[attr];
                for (let i = 0; i < vis.imperfectionsB1[attr].length; i++) {
                    vis[attr].push(vis.imperfectionsB1[attr][i]);
                }
            }
        }
        for (let attr in vis.imperfectionsB1n) {
            if (vis.imperfectionsB1n[attr].length > 1) {
                vis.CLEANimperfectionsB1n[attr] = vis.imperfectionsB1n[attr];
                for (let i = 0; i < vis.imperfectionsB1n[attr].length; i++) {
                    vis[attr].push(vis.imperfectionsB1n[attr][i]);
                }
            }
        }
        for (let attr in vis.imperfectionsB1m) {
            if (vis.imperfectionsB1m[attr].length > 0) {
                vis.CLEANimperfectionsB1m[attr] = vis.imperfectionsB1m[attr];
                for (let i = 0; i < vis.imperfectionsB1m[attr].length; i++) {
                    vis[attr].push(vis.imperfectionsB1m[attr][i]);
                }
            }
        }
        for (let attr in vis.imperfectionsB2) {
            if (vis.imperfectionsB2[attr].length > 0) {
                console.log(attr);
                vis.CLEANimperfectionsB2[attr] = vis.imperfectionsB2[attr];
                for (let i = 0; i < vis.imperfectionsB2[attr].length; i++) {
                    vis[attr].push(vis.imperfectionsB2[attr][i]);
                }
            }
        }

        console.log("yes", vis.y);
        console.log("no", vis.n);

        // group by # of imperfections
        vis.impY = this.groupBy(vis.y, "imp_condition");
        vis.impN = this.groupBy(vis.n, "imp_condition");
        console.log(vis.impY);
        console.log(vis.impN);

        vis.CLEANimpY = {}
        vis.CLEANimpN = {}

        vis.imp0 = []
        vis.imp1_3 = []
        vis.imp4_7 = []
        vis.imp8_10 = []

        // CLEANING # of imperfections
        for (let attr in vis.impY) {
            if (vis.impY[attr].length > 0) {
                vis.CLEANimpY[attr] = vis.impY[attr];
                for (let i = 0; i < vis.impY[attr].length; i++) {
                    vis[attr].push(vis.impY[attr][i]);
                }
            }
        }
        for (let attr in vis.impN) {
            if (vis.impN[attr].length > 0) {
                vis.CLEANimpN[attr] = vis.impN[attr];
                for (let i = 0; i < vis.impN[attr].length; i++) {
                    vis[attr].push(vis.impN[attr][i]);
                }
            }
        }

        // group by mass
        vis.mass0 = this.groupBy(vis.imp0, "mass_cond");
        vis.mass1_3 = this.groupBy(vis.imp1_3, "mass_cond");
        vis.mass4_7 = this.groupBy(vis.imp4_7, "mass_cond");
        vis.mass8_10 = this.groupBy(vis.imp8_10, "mass_cond");

        // Cleaning the group by mass
        vis.CLEANmass0 = {}
        vis.CLEANmass1_3 = {}
        vis.CLEANmass4_7 = {}
        vis.CLEANmass8_10 = {}

        // CLEANING # of imperfections
        for (let attr in vis.mass0){
            if (vis.mass0[attr].length > 0) {
                vis.CLEANmass0[attr] = vis.mass0[attr];
            }
        }
        for (let attr in vis.mass1_3){
            if (vis.mass1_3[attr].length > 0) {
                vis.CLEANmass1_3[attr] = vis.mass1_3[attr];
            }
        }
        for (let attr in vis.mass4_7){
            if (vis.mass4_7[attr].length > 0) {
                vis.CLEANmass4_7[attr] = vis.mass4_7[attr];
            }
        }
        for (let attr in vis.mass8_10){
            if (vis.mass8_10[attr].length > 0) {
                vis.CLEANmass8_10[attr] = vis.mass8_10[attr];
            }
        }


        // flow: layer -> imperfections -> # of imperfections -> mass

        vis.nodes = []
        // nodes: layers
        for (let attr in vis.layerGroup) {
            vis.nodes.push({ id: attr})
        }
        // nodes: imperfections Y/N
        let imperfectionsSet = new Set()
        for (let attr in vis.CLEANimperfectionsB) {
            imperfectionsSet.add(attr)
            vis.nodes.push({ id: attr})
        }
        for (let attr in vis.CLEANimperfectionsB1) {
            if (imperfectionsSet.has(attr)) {
                continue
            } else {
                imperfectionsSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANimperfectionsB1n) {
            if (imperfectionsSet.has(attr)) {
                continue
            } else {
                imperfectionsSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANimperfectionsB1m) {
            if (imperfectionsSet.has(attr)) {
                continue
            } else {
                imperfectionsSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANimperfectionsB2) {
            if (imperfectionsSet.has(attr)) {
                continue
            } else {
                imperfectionsSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        // nodes: # of imperfections
        let numImpSet = new Set()
        for (let attr in vis.CLEANimpY) {
            numImpSet.add(attr)
            vis.nodes.push({ id: attr})
        }
        for (let attr in vis.CLEANimpY) {
            if (numImpSet.has(attr)) {
                continue
            } else {
                numImpSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANimpN) {
            if (numImpSet.has(attr)) {
                continue
            } else {
                numImpSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        // nodes: mass
        let massSet = new Set()
        for (let attr in vis.CLEANmass0) {
            massSet.add(attr)
            vis.nodes.push({ id: attr})
        }
        for (let attr in vis.CLEANmass1_3) {
            if (massSet.has(attr)) {
                continue
            } else {
                massSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANmass4_7) {
            if (massSet.has(attr)) {
                continue
            } else {
                massSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        for (let attr in vis.CLEANmass8_10) {
            if (massSet.has(attr)) {
                continue
            } else {
                massSet.add(attr)
                vis.nodes.push({ id: attr})
            }
        }
        console.log(vis.nodes);

        // create links
        vis.links = []
        // links: layer to imperfection Y/N
        for (let attr in vis.CLEANimperfectionsB) {
            vis.links.push({ source: "b", target: attr, value: vis.CLEANimperfectionsB[attr].length})
        }
        for (let attr in vis.CLEANimperfectionsB1) {
            vis.links.push({ source: "b1", target: attr, value: vis.CLEANimperfectionsB1[attr].length})
        }
        for (let attr in vis.CLEANimperfectionsB1n) {
            vis.links.push({ source: "b1n", target: attr, value: vis.CLEANimperfectionsB1n[attr].length})
        }
        for (let attr in vis.CLEANimperfectionsB1m) {
            vis.links.push({ source: "b1m", target: attr, value: vis.CLEANimperfectionsB1m[attr].length})
        }
        for (let attr in vis.CLEANimperfectionsB2) {
            vis.links.push({ source: "b2", target: attr, value: vis.CLEANimperfectionsB2[attr].length})
        }
        // links: imperfection Y/N to # of imperfections
        for (let attr in vis.CLEANimpY) {
            vis.links.push({ source: "y", target: attr, value: vis.CLEANimpY[attr].length})
        }
        for (let attr in vis.CLEANimpN) {
            vis.links.push({ source: "n", target: attr, value: vis.CLEANimpN[attr].length})
        }
        // links: imperfection # of imperfections to mass
        for (let attr in vis.CLEANmass0) {
            vis.links.push({ source: "imp0", target: attr, value: vis.CLEANmass0[attr].length})
        }
        for (let attr in vis.CLEANmass1_3) {
            vis.links.push({ source: "imp1_3", target: attr, value: vis.CLEANmass1_3[attr].length})
        }
        for (let attr in vis.CLEANmass4_7) {
            vis.links.push({ source: "imp4_7", target: attr, value: vis.CLEANmass4_7[attr].length})
        }
        for (let attr in vis.CLEANmass8_10) {
            vis.links.push({ source: "imp8_10", target: attr, value: vis.CLEANmass8_10[attr].length})
        }

        vis.sankeyData = {
            nodes: vis.nodes,
            links: vis.links
        }

        console.log("SANKEY DATA", vis.sankeyData);

        // set the dimensions and margins of the graph
        vis.margin = {top: 20, right: 10, bottom: 10, left: 10};
        vis.width = 1200 - vis.margin.left - vis.margin.right;
        vis.height = 800 - vis.margin.top - vis.margin.bottom;

        vis.title = d3.select("#title").append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.margin.top + vis.margin.bottom + 30)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // init drawing area
        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.title.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .text('Relationships between Measures of Levallois Cores')
            .attr('transform', `translate(${vis.width / 2}, 5)`)
            .attr('text-anchor', 'middle');

        vis.sankey = d3.sankey()
            .size([vis.width, vis.height])
            .nodeId(d => d.id)
            .nodeWidth(20)
            .nodePadding(20)
            .nodeAlign(d3.sankeyCenter);

        vis.graph = vis.sankey(vis.sankeyData);

        vis.xAxis = d3.scaleLinear()
            .range([0, vis.width])
            .domain(d3.extent(this.getFields(vis.graph.nodes, "x0")));

        vis.yAxis = d3.scaleLinear()
            .range([vis.height, 0])
            .domain(d3.extent(this.getFields(vis.graph.nodes, "y0")));

        vis.colorScale =  d3.scaleQuantize()
            .domain([1,25])
            .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598"]);

        vis.links = vis.svg
            .append("g")
            .classed("links", true)
            .selectAll("path")
            .data(vis.graph.links)
            .enter()
            .append("path")
            .classed("link", true)
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("fill","none")
            .attr("stroke",  function(d, i){
                return vis.colorScale(i)
            })
            .attr("stroke-width", d => d.width)
            .attr("stroke-opacity", 0.5)
            .on("mouseover", function(d) {
                let unRelatedLinks;
                let unRelatedNodes = []
                let nodeSet = new Set()
                if (d.toElement.__data__.source.layer == 0) {
                    let target = d.toElement.__data__.target.id;
                    unRelatedLinks = Object.values(d3.selectAll(".link")._groups[0]).filter(d => d.__data__.source.id != target);
                    for (let i = 0; i < unRelatedLinks.length; i++) {
                        d3.select(unRelatedLinks[i]).attr("stroke-opacity", 0.1)
                    }
                    unRelatedNodes = Object.values(d3.selectAll(".link")._groups[0]).filter(d => d.__data__.source.id == target);

                } else {
                    unRelatedLinks = Object.values(d3.selectAll(".link")._groups[0]);
                    for (let i = 0; i < unRelatedLinks.length; i++) {
                        d3.select(unRelatedLinks[i]).attr("stroke-opacity", 0.1)
                    }
                    nodeSet.add(d.toElement.__data__.target.id);
                }

                nodeSet.add(d.toElement.__data__.source.id);
                for (let i = 0; i < unRelatedNodes.length; i++) {
                    nodeSet.add(unRelatedNodes[i].__data__.source.id)
                    nodeSet.add(unRelatedNodes[i].__data__.target.id)
                }
                let allNodes = Object.values(d3.selectAll(".node")._groups[0])
                let allText = Object.values(d3.selectAll(".text")._groups[0])
                for (let i = 0; i < allNodes.length; i++) {
                    if (nodeSet.has(allNodes[i].id) == false) {
                        d3.select(allNodes[i]).attr("opacity", 0.1)
                        d3.select(allText[i]).attr("opacity", 0.1)
                    }
                }
                d3.select(this).attr("stroke-opacity", 0.5);
            })
            .on("mouseleave", function(d) {
                let target = d.fromElement.__data__.target.id;
                let relatedLinks = Object.values(d3.selectAll(".link")._groups[0]).filter(d => d.__data__.source.id != target);
                for (let i = 0; i < relatedLinks.length; i++) {
                    d3.select(relatedLinks[i]).attr("stroke-opacity", 0.5)
                }
                let allNodes = Object.values(d3.selectAll(".node")._groups[0])
                let allText = Object.values(d3.selectAll(".text")._groups[0])
                for (let i = 0; i < allNodes.length; i++) {
                    d3.select(allNodes[i]).attr("opacity", 0.8)
                    d3.select(allText[i]).attr("opacity", 1)
                }
            });


        vis.nodes = vis.svg
            .append("g")
            .classed("nodes", true)
            .selectAll("rect")
            .data(vis.graph.nodes)
            .enter();

        vis.nodes.append("rect")
            .classed("node", true)
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            // .attr("fill", (d,i) => { console.log(d.id) })
            .attr("fill",  function(d, i){
                return vis.colorScale(i)
            })
            // .attr("opacity", 0.8)
            .attr("id", d => d.id);

        vis.names = [{"id":"b", "text":"B"},{"id":"b1", "text":"B1"},{"id":"b1n", "text":"B1n"},{"id":"b1m", "text":"B1m"},
            {"id":"b2", "text":"B2"}, {"id":"y", "text":"Yes"}, {"id":"n", "text":"No"}, {"id":"imp1_3", "text":"1-3"},
            {"id":"imp4_7", "text":"4-7"}, {"id":"imp8_10", "text":"8-10"}, {"id":"imp0", "text":"0"}, {"id":"massu50", "text":"Under 50g"},
            {"id":"massu50", "text":"Under 50g"}, {"id":"mass50_100", "text":"50g-100g"}, {"id":"mass100_200", "text":"100g-200g"}, {"id":"mass200p", "text":"More than 200g"}]


        // add in the title for the nodes
        vis.nodes.append("text")
            .classed("text", true)
            .attr("x", d => {
                if (d.x0 > vis.width / 2) {
                    return d.x0 - vis.sankey.nodeWidth() + 10
                } else {
                    return d.x0 + vis.sankey.nodeWidth() + 10
                }
            })
            .attr("y", d => ((d.y1 - d.y0) / 2) + d.y0)
            .attr("dy", ".35em")
            .attr("text-anchor", d => (d.x0 < vis.width / 2) ? "start" : "end")
            .attr("transform", null)
            .attr("id", d => d.id)
            .text(function(d){
                let name = d.id;
                vis.names.forEach(function(f){
                    if(name === f.id) {
                        name = f.text;
                    }
                })
                return name;
            });

        vis.labels = ["Layer", "Imperfection? (y/n)", "# of Imperfections", "Mass"]

        vis.labels.forEach(function(f, i) {
            let x_move = i * 378 +vis.margin.left;
            console.log(x_move)
            vis.title.append("text")
                .attr("x", x_move)
                .attr("y", vis.margin.bottom + vis.margin.top)
                .text(vis.labels[i]);
        });


        }

    color(index) {
        let ratio = index / (this.sankeyData.nodes.length - 1.0);
        // console.log(this.colorScale(ratio))
        return this.colorScale(ratio);
    }

    getFields(input, field) {
        let output = [];
        for (let i=0; i < input.length ; ++i)
            output.push(input[i][field]);
        return output;
    }
}