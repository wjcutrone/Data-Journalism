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

//Initial Params
var chosenXAxis = "obesity";
var chosenYAxis = "poverty";

//Function used for updating the xscale upon click on different axis label
function setXScale(censusData, chosenXAxis, chartWidth) {
    var xScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis])*0.5, 
            d3.max(censusData, d => d[chosenXAxis] * 1.5)])
        .range([0, chartWidth]);
    
    return xScale;
}

//Function used for rendering the new xAxis to the html
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

//Function used for updating the yscale upon click on different axis label
function setYScale(censusData, chosenYAxis, chartHeight) {
    var yScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis])*0.5, 
            d3.max(censusData, d => d[chosenYAxis] * 1.5)])
        .range([chartHeight, 0]);
    
    return yScale;
}

//Function used for rendering the new xAxis to the html
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
}


//function to update circles group 
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

//Function to render text
function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;
}

//Retrieve Data from the csv
d3.csv("assets/data/census.csv").then(function(censusData) {

    //Parse Data
    censusData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.age = +data.age;

    });
    
    //XScale function 
    var xScale = setXScale(censusData, chosenXAxis, chartWidth);
    var yScale = setYScale(censusData, chosenYAxis, chartHeight);


    //YScale Funcion
    // var yScale = d3.scaleLinear()
    //     .domain([0, d3.max(censusData, d => d.poverty)])
    //     .range([chartHeight, 0]);

    //Create initial axes functions
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    //Append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    //Append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    //Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 18)
        .attr("fill", "green")
        .attr("opacity", "0.5")
        .classed("stateCircle", true);
    
    var textGroup = chartGroup.append("g")
        .selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 3)
        .text(d => d.abbr)
        .classed("stateText", true)
        .attr("text-anchor", "middle");

    //Create groups for multiple x axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth/ 2}, ${chartHeight + 20})`);

    var obesityLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "obesity")
        .classed("active", true)
        .text("Percent of Obese People in State");

    var smokesLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "smokes") 
        .classed("inactive", true)
        .text("Percent of Smokers in State");

    var healthCareLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "healthcare") 
        .classed("inactive", true)
        .text("Percent of People who Lack Healthcare");
    
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");
    
    var povertyLabel = yLabelsGroup.append("text")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", 60 - margin.left)
        .attr("dy", "1em")
        .attr("value", "poverty") 
        .classed("inactive", true)
        .text("Percent of People in Poverty");
    
    var ageLabel = yLabelsGroup.append("text")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", 40 - margin.left)
        .attr("dy", "1em")
        .attr("value", "age") 
        .classed("inactive", true)
        .text("Age");
    
    var incomeLabel = yLabelsGroup.append("text")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", 20 - margin.left)
        .attr("dy", "1em")
        .attr("value", "income") 
        .classed("inactive", true)
        .text("Household Income");

    


    //append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Percent of People in Poverty in State");
    
    //x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
            //value of selection
            var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {
                    chosenXAxis = value;
                    xScale = setXScale(censusData, chosenXAxis, chartWidth);
                    xAxis = renderXAxes(xScale, xAxis);
                    circlesGroup = renderCircles(circlesGroup, xScale, yScale, chosenYAxis, chosenXAxis);
                    textGroup = renderText(textGroup, xScale, yScale, chosenYAxis, chosenXAxis);
                    if(chosenXAxis === "smokes") {
                        smokesLabel
                            .classed("active", true)
                            .classed("inactive", false); 
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);    
                        healthCareLabel
                            .classed("active", false)
                            .classed("inactive", true);  
                    } else if (chosenXAxis === "obesity") {
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true); 
                        obesityLabel
                            .classed("active", true)
                            .classed("inactive", false);    
                        healthCareLabel
                            .classed("active", false)
                            .classed("inactive", true);  
                    } else {
                        smokesLabel 
                            .classed("active", false)
                            .classed("inactive", true);
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        healthCareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        }
                    }
        });

        yLabelsGroup.selectAll("text")
        .on("click", function() {
            //value of selection
            var value = d3.select(this).attr("value");
                if (value !== chosenYAxis) {
                    chosenYAxis = value;
                    yScale = setYScale(censusData, chosenYAxis, chartHeight);
                    yAxis = renderYAxes(yScale, yAxis);
                    circlesGroup = renderCircles(circlesGroup, xScale, yScale, chosenYAxis, chosenXAxis);
                    textGroup = renderText(textGroup, xScale, yScale, chosenYAxis, chosenXAxis);
                    if(chosenYAxis === "poverty") {
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false); 
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);    
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);  
                    } else if (chosenYAxis === "age") {
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true); 
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);    
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);  
                    } else {
                        povertyLabel 
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        }
                    }
                });
}).catch(function(error) {
    console.log(error);
});
        































// var chartGroup = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

// //Import data
// d3.csv("assets/data/census.csv").then(function(censusData) {

//     //Parse Data
//     censusData.forEach(function(data) {
//         data.obesity = +data.obesity;
//         data.poverty = +data.poverty;
//     });

//     //Create Scales
//     var xScale = d3.scaleLinear()
//         .domain([0, d3.max(censusData, d => d.obesity)])
//         .range([0, chartWidth]);
    
//     var yScale = d3.scaleLinear()
//         .domain([0, d3.max(censusData, d => d.poverty)])
//         .range([chartHeight,0]);
    
//     //Create Axes
//     var bottomAxis = d3.axisBottom(xScale);
//     var leftAxis = d3.axisLeft(yScale);

//     //Append Axes to Chart
//     chartGroup.append("g")
//         .attr("transform", `translate(0, ${chartHeight})`)
//         .call(bottomAxis);
    
//     chartGroup.append("g")
//         .call(leftAxis);
    
//     //Create circles for data points
//     var circlesGroup = chartGroup.selectAll("circle")
//         .data(censusData)
//         .enter()
//         .append("circle")
//         .attr("cx", d => xScale(d.obesity))
//         .attr("cy", d => yScale(d.poverty))
//         .attr("r", 18)
//         .attr("fill", "green")
//         .attr("opacity", "0.5")
        
//         //Enable text to be added to the circles
//         var cicleLabels = chartGroup.selectAll(null).data(censusData)
//             .enter()
//             .append("text");
        
//         //Fill circles with the state names
//         cicleLabels
//             .attr("x", function(d) {
//                 return xScale(d.obesity)
//             })
//             .attr("y", function(d) {
//                 return yScale(d.poverty)
//             })
//             .text(function(d) {
//                 return d.abbr;
//             })
//             .attr("font-family", "sans-serif")
//             .attr("font-size", "10px")
//             .attr("text-anchor", "middle")
//             .attr("fill", "blue");

//             //Axes Labels
//             //y axis label
//             chartGroup.append("text")
//                 .attr("transform", "rotate(-90)")
//                 .attr("y", 0 - margin.left + 40)
//                 .attr("x", 0 - (chartHeight/2))
//                 .attr("dy", "1em")
//                 .attr("class", "axisText")
//                 .text("Percent in Poverty")
//             //x axis label
//             chartGroup.append("text")
//                 .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margin.top + 30})`)
//                 .attr("class", "axisText")
//                 .text("Percent Obese");

//         }).catch(function(error) {
//             console.log(error);
//         });