// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 30,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

  var circRadius;
  function crGet() {
    if (width <= 530) {
      circRadius = 8;
    }
    else {
      circRadius = 16;
    }
  }
  crGet();

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty" || "age" || "income";
var chosenYAxis = "obesity" || "smokes" || "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
      d3.max(data, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.9,
      d3.max(data, d => d[chosenYAxis]) * 1.1
    ])
    .range([height, 0]);
  return yLinearScale;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis,) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]))
  return circlesGroup;
}

function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis,) {
  circlesGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis]))
  return textGroup;
}

function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis,) {
  textGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis]))
  return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "In Poverty (%)";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age (Median)";  
  }
  else if (chosenXAxis === "income") {
    var xlabel = "Household Income (Median)";  
  }
  
  if (chosenYAxis === "healthcare") {
    var ylabel = "Lacks Healthcare (%)";
  }
  else if (chosenYAxis === "smokes") {
    var ylabel = "Smokes (%)";  
  }
  else if (chosenYAxis === "obesity") {
    var ylabel = "Obesity (%)";  
  }
  
  
var tipname = {poverty:"%"}

var tiptitle = {poverty:"Poverty", age: "Age", income: "Income", obesity: "Obesity", smokes:"Smokes", healthcare: "Healthcare"}

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-8, 0])
    .html(function(d) {
      return (`${d.state}<br>${tiptitle[chosenXAxis]}: ${d[chosenXAxis]}${tipname[chosenXAxis]} <br>${tiptitle[chosenYAxis]}: ${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event    
    .on("mouseout", function(data, index) {
      toolTip.hide(data, this);
    });
  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;
  
    // parse data
    data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare= +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });

  // xLinearScale and yLinearScale functions above csv import
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)      
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", circRadius)
      .attr("class", function(d) {
        return "stateCircle" + d.abbr;
      })
      .attr("fill", "skyblue");
    var textGroup = chartGroup.selectAll("#stateText")
      .data(data)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d[chosenYAxis]) + circRadius / 1.7)
      .attr("font-size", circRadius)
      .attr("class", "stateText")
      .attr("fill", "white");
      
    // Create groups for  3 x-axis and 3 y-axis labels
    var xlabelsGroup = chartGroup.append("g");
    var ylabelsGroup = chartGroup.append("g");
 
var povertyLabel = xlabelsGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + 40})`)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");

var ageLabel = xlabelsGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + 60})`)
  .attr("value", "age") // value to grab for event listener
  .classed("inactive", true)
  .text("Age (Median)");

var incomeLabel = xlabelsGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + 80})`)
  .attr("value", "income") // value to grab for event listener
  .classed("inactive", true)
  .text("Household Income (Median)");

var healthcareLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .attr("value", "healthcare")
  .classed("inactive", true)
  .text("Lacks Healthcare (%)"); 

  var smokesLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 20)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .attr("value", "smokes")
  .classed("inactive", true)
  .text("Smokes (%)"); 

  var obesityLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .attr("value", "obesity")
  .classed("active", true)
  .text("Obesity (%)"); 

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

// x axis labels event listener
xlabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var xValue = d3.select(this).attr("value");
    
      chosenXAxis = xValue;
  
      // updates x scale for new data
      xLinearScale = xScale(data, chosenXAxis);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale,chosenYAxis);
      textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale,chosenYAxis);
      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "income") {
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      else if (chosenXAxis === "age") {
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      else {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
   });

// y axis labels event listener
ylabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var yValue = d3.select(this).attr("value");
    
      chosenYAxis = yValue;

      // updates y scale for new data
      yLinearScale = yScale(data, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale,chosenYAxis);
      textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale,chosenYAxis);
      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      else if (chosenYAxis === "smokes") {
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      else {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    // }
  });


}).catch(function(error) {
console.log(error);
});