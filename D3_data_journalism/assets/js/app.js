//Create bounds for the SVG
var svgWidth = 950;
var svgHeight = 500;

//Set up Margins
var margin = {
    top: 20,
    bottom: 60,
    left: 100,
    right: 40
};

//Chart Boundaries
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//Create SVG wrapper and append an SVG group
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import data
d3.csv("assets/data/census.csv").then(function(censusData) {

    //Parse Data
    censusData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
    });

    //Create Scales
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.obesity)])
        .range([0, chartWidth]);
    
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.poverty)])
        .range([chartHeight,0]);
    
    //Create Axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    //Append Axes to Chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);
    
    //Create circles for data points
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.obesity))
        .attr("cy", d => yScale(d.poverty))
        .attr("r", 18)
        .attr("fill", "green")
        .attr("opacity", "0.5")
        
        //Enable text to be added to the circles
        var cicleLabels = chartGroup.selectAll(null).data(censusData)
            .enter()
            .append("text");
        
        //Fill circles with the state names
        cicleLabels
            .attr("x", function(d) {
                return xScale(d.obesity)
            })
            .attr("y", function(d) {
                return yScale(d.poverty)
            })
            .text(function(d) {
                return d.abbr;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr("fill", "blue");

            //Axes Labels
            //y axis label
            chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (chartHeight/2))
                .attr("dy", "1em")
                .attr("class", "axisText")
                .text("Percent in Poverty")
            //x axis label
            chartGroup.append("text")
                .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margin.top + 30})`)
                .attr("class", "axisText")
                .text("Percent Obese");

        }).catch(function(error) {
            console.log(error);
        });