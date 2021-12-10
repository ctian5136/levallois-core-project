/* * * * * * * * * * * * * *
*     class ScatterVis     *
* * * * * * * * * * * * * */

class ScatterVis {
    constructor(parentElement, _data) {
        this.parentElement = parentElement;
        this.data = _data;
        this.displayData = [];

        this.initVis()
    }

    initVis() {
        let vis = this;

        // set the dimensions and margins of the graph
        vis.margin = {top: 10, right: 30, bottom: 30, left: 60};
        vis.width = 460 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        // append the svg object to the body of the page
        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // List of groups (here I have one group per column)
        var allGroup = ["mass", "length", "height", "width"]

        // add the options to the button
        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; }) // corresponding value


        var layers = ["b", "b1", "b1n", "b1m", "b2" ]
        // Add X axis
        vis.x = d3.scaleLinear()
            .domain([0,750])
            .range([0, vis.width]);
        vis.xAxis = vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x));

        // Add Y axis
        vis.y = d3.scaleBand()
            .domain(layers)
            .range([vis.height, 0]);
        vis.yAxis =vis.svg.append("g")
            .attr("class", "axis y-axis")
            .call(d3.axisLeft(vis.y));

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
            .attr("transform", "translate(0," + 35+ ")")
            .attr("class", function (d) { return "dot " + d.layer} )
            .attr("cx", function (d) { return vis.x(d.mass); } )
            .attr("cy", function (d) { return vis.y(d.layer); } )
            .attr("r", 5)
            .style("fill", function (d) { return vis.color(d.layer) } );

        vis.title = vis.svg.append('g')
            .attr("class", "title")
            .append("text")
            .text("Mass v Layers")
            .attr("transform", "translate(" + vis.margin.left + ", "+ 10 + ")");

        this.wrangleData();

    }

    wrangleData(){
        let vis = this;

        function update(selectedGroup) {
            // Create new data with the selection?
            vis.dataFilter = vis.data.map(function (d) {
                return {x_axis: d[selectedGroup], y_axis: d.layer}
            })

            console.log("data", vis.dataFilter);

            var max = Math.max.apply(Math, vis.dataFilter.map(function(o) { return o.x_axis; }));

            vis.newScale = vis.x.domain([0, max]);
            // remove any previously drawn axis
            vis.xAxis.selectAll("axis x-axis").remove();
            vis.xAxis.call(d3.axisBottom(vis.newScale));

            vis.dots
                .data(vis.dataFilter)
                .enter()
                .append("circle")
                .merge(vis.dots)
                .transition()
                .duration(800)
                .attr("transform", "translate(0," + 35+ ")")
                .attr("class", function (d) { return "dot " + d.y_axis} )
                .attr("cx", function (d) { return vis.newScale(d.x_axis); } )
                .attr("cy", function (d) { return vis.y(d.y_axis); } )
                .attr("r", 5)
                .style("fill", function (d) { return vis.color(d.y_axis) } );

            vis.setTitle = selectedGroup + " v layers";

            d3.selectAll(vis.title).text(vis.setTitle);

        }
        // Highlight the layer that is hovered
        let highlight = function (event, d) {

            if(d.layer === undefined){
                vis.selected_layer = d.y_axis;
            }
            else{
                vis.selected_layer = d.layer;
            }

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

            d3.select('#layer')
                .text(vis.selected_layer);
        }

        // Highlight the specie that is hovered
        let doNotHighlight = function (event, d) {
            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("fill", function(d){
                    if(d.layer === undefined){
                        return vis.color(d.y_axis);
                    }
                    else{
                        return vis.color(d.layer);
                    }
                })
                .attr("r", 5);

            d3.select('#layer')
                .text("-");
        }

        vis.dots
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight);




        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            console.log(selectedOption);
            // run the updateChart function with this selected option
            update(selectedOption)
        })

    }
}