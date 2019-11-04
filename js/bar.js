function bar() {

  var self = this; // for internal d3 functions
  var margin = {top: 20, right: 160, bottom: 35, left: 30};

  var width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  /* Data in strings like it would be if imported from a csv */

  d3.csv("data/2018_R_per_kommun.csv", function(data1) {
    d3.csv("data/Anvisningar_enligt_kommuntalen_2018.csv", function(data2) {
      d3.csv("data/socialScience.csv", function(data) {
        /*------------------ Cleaning -------------------*/
        data2.forEach((item, index) => {
          if(!isNaN(parseInt(item.Kommunkod))) {
            item.Kommunkod = parseInt(item.Kommunkod.substr(2));
          }
        });
        /*-----------------------------------------------*/

        data.forEach((item, index) => {
          /*------------------ Cleaning -------------------*/
          item.Länskod = parseInt(item.Region.substr(0, 2));
          item.Kommunkod = parseInt(item.Region.substr(2, 2));
          item.Kommun = item.Region.substr(5);
          delete item.Region;

          /*---------- Inserting election data ------------*/
          let index2 = data1.findIndex(i => i.KOMMUNNAMN == item.Kommun);

          item.Län = data1[index2].LÄNSNAMN; //missing "län" in data
          item.Riksdagsval = {
            M: {percent: parseInt(data1[index2].M), color: "#66BEE6"},
            C: {percent: parseInt(data1[index2].C), color: "#63A91D"},
            L: {percent: parseInt(data1[index2].L), color: "#3399FF"},
            KD: {percent: parseInt(data1[index2].KD), color: "#1B5CB1"},
            S: {percent: parseInt(data1[index2].S), color: "#FF0000"},
            V: {percent: parseInt(data1[index2].V), color: "#C40000"},
            MP: {percent: parseInt(data1[index2].MP), color: "#008000"},
            SD: {percent: parseInt(data1[index2].SD), color: "#4E83A3"},
          };

          /*--------- Inserting immigrant data ------------*/

          let index3 = data2.findIndex(i => i.Kommun.toLowerCase() == item.Kommun.toLowerCase());
          //console.log(index3);
          if(index3 != -1) {
            item["Asylsökande 2018"] = parseInt(data2[index3].Mottagna);
          }
        });

        self.data = data;

  //var parse = d3.time.format("%Y").parse;
  //console.log(data);


  //Transpose the data into layers
  var dataset = d3.layout.stack()(["M", "C", "L", "KD", "S", "V", "MP", "SD"].map(function(party) {
    return data.map(function(d) {
       // console.log(d.Kommun);
       //console.log(d.Kommun, d.Riksdagsval[party].percent);
      return {x: d.Kommun, y: +d.Riksdagsval[party].percent};
    });
  }));
  console.log(dataset);


  // Set x, y and colors
  var x = d3.scale.ordinal()
    .domain(dataset[0].map(function(d) { return d.x; }))
    .rangeRoundBands([10, width-10], 0.02);

  var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
    .range([height, 0]);

  var colors = ["#66BEE6", "#63A91D", "#3399FF", "#1B5CB1", "#FF0000", "#C40000", "#008000", "#4E83A3"];

  // Define and draw axes
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(8)
    .tickSize(-width, 0, 0)
    .tickFormat( function(d) { return d } );

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y"));

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);


  // Create groups for each series, rects for each segment
  var groups = svg.selectAll("g.cost")
    .data(dataset)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { return colors[i]; });

  var rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.y);
    });


  // Draw legend
  var legend = svg.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {return colors.slice().reverse()[i];});

  legend.append("text")
    .attr("x", width + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d, i) {
      switch (i) {
        case 0: return "M";
        case 1: return "C";
        case 2: return "L";
        case 3: return "KD";
        case 4: return "S";
        case 5: return "V";
        case 6: return "MP";
        case 7: return "SD";
      }
    });



  // Prep the tooltip bits, initial display is hidden
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
  });});});
}
