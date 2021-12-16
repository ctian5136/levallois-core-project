/* * * * * * * * * * * * * *
*     class CompVis        *
* * * * * * * * * * * * * */

class CompareVis {
    constructor(parentElement, _data) {
        this.parentElement = parentElement;
        this.data = _data;
        this.displayData = [];

        this.initVis()
    }

    initVis() {
        let vis = this;

        // set the dimensions and margins of the graph
        vis.margin = {top: 10, right: 30, bottom: 100, left: 60};
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 450 - vis.margin.top - vis.margin.bottom;

        // append the svg object to the body of the page
        vis.svg = d3.select("#compareVis")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // List of groups (here I have one group per column)
        var allGroup = ["mass", "length", "height", "width"]

        // var layers = ["b", "b1", "b1n", "b1m", "b2" ]

        // Add X axis
        vis.x = d3.scaleLinear()
            .domain([0,750])
            .range([0, vis.width]);
        vis.xAxis = vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x));

        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", vis.width)
            .attr("y", vis.height + 30)
            .text("Mass of Levallois Core (g)");

        // Add Y axis
        vis.y = d3.scaleLinear()
            .domain([0, 10])
            .range([vis.height, 0]);
        vis.yAxis =vis.svg.append("g")
            .attr("class", "axis y-axis")
            .call(d3.axisLeft(vis.y));
        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            // .attr("x", vis.height)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("# of Step Fractures");

        // Color scale: give me a layer name, I return a color
        vis.color = d3.scaleOrdinal()
            .domain(["b1", "b2", "b", "b1n", "b1m"])
            .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598"]);

        // Add dots
        vis.dots = vis.svg.append('g')
            .selectAll("dot")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("transform", "translate(0," + 0+ ")")
            .attr("class", function (d) { return "dot " + d.layer} )
            .attr("cx", function (d) { return vis.x(d.mass); } )
            .attr("cy", function (d) { return vis.y(d.step_fractures); } )
            .attr("r", 5)
            .style("fill", function (d) { return vis.color(d.layer) } );

        vis.title = vis.svg.append('g')
            .attr("class", "title")
            .append("text")
            .text("Mass v. # of step fractures")
            .attr("transform", "translate(" + vis.margin.left + ", "+ 10 + ")");

        this.wrangleData();

    }

    wrangleData(){
        let vis = this;
        // Highlight the layer that is hovered
        let highlight = function (event, d) {

            vis.selected_layer = d.layer;

            console.log(vis.selected_layer);

            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("fill", "lightgrey")
                .attr("r", 3);

            d3.selectAll("." + vis.selected_layer)
                .transition()
                .duration(200)
                .style("fill", vis.color(vis.selected_layer))
                .attr("r", 7);

            d3.select('#layer-compare')
                .text(vis.selected_layer);
        }

        // Highlight the specie that is hovered
        let doNotHighlight = function (event, d) {
            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("fill", function(d){
                    if(d.layer === undefined){
                        return vis.color(d.layer);
                    }
                    else{
                        return vis.color(d.layer);
                    }
                })
                .attr("r", 5);

            d3.select('#layer-compare')
                .text("-");
        }

        vis.dots
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight);


    }
}