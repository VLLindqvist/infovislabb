const format = ["M", "C", "L", "KD", "MP", "S", "V", "SD", "A"];

function bar(){
    var self = this; // for internal d3 functions

    var barDiv = $("#bar");
    var stackedbarDiv = $("#stackedbar");

    var margin1 = {top: 20, right: 20, bottom: 90, left: 90},
        margin2 = {top: 40, right: 30, bottom: 90, left: 25},
        width1 = barDiv.width() - margin1.right - margin1.left,
        height1 = barDiv.height() - margin1.top - margin1.bottom;
        width2 = stackedbarDiv.width() - margin2.right - margin2.left,
        height2 = stackedbarDiv.height() - margin2.top - margin2.bottom;

    var color = d3.scale.category20c();//color brewer

    var tooltip1 = d3.select("#bar").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    var tooltip2 = d3.select("#stackedbar").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var x1 = d3.scale.ordinal()
        .domain([1994, 1998, 2002, 2006, 2010, 2014, 2018])
        .rangePoints([0, width1]);
    var x2 = d3.scale.ordinal()
        .rangeRoundBands([0, width2], .1);

    var y1 = d3.scale.linear()
        .range([height1, 0]);
    var y2 = d3.scale.linear()
        .range([height2, 0]);

    var xAxis1 = d3.svg.axis()
        .scale(x1)
        .orient("bottom");
    var xAxis2 = d3.svg.axis()
        .scale(x2)
        .orient("bottom");

    var yAxis1 = d3.svg.axis()
        .scale(y1)
        .tickFormat(d => d + "%")
        .orient("left");
    var yAxis2 = d3.svg.axis()
        .scale(y2)
        .orient("left");

    var svg1 = d3.select("#bar").append("svg")
        .attr("width", width1 + margin1.left + margin1.right)
        .attr("height", height1 + margin1.top + margin1.bottom)
        .append("g")
        .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");
    var svg2 = d3.select("#stackedbar").append("svg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
        .append("g")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    d3.csv("data/2018_R_per_kommun.csv", function(data1) {
      d3.csv("data/Anvisningar_enligt_kommuntalen_2018.csv", function(data2) {
        d3.csv("data/riksdagsval.csv", function(data3) {
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
              let munVotes = data3.filter(i => i.Region == item.Region);
              delete item.Region;

              /*---------- Inserting election data ------------*/
              let index1 = data1.findIndex(i => i.KOMMUNNAMN == item.Kommun);
              item.Län = data1[index1].LÄNSNAMN; //missing "län" in data

              item.Riksdagsval = [
                {percent: {
                  "1994": parseFloat(munVotes[0][1994]),
                  "1998": parseFloat(munVotes[0][1998]),
                  "2002": parseFloat(munVotes[0][2002]),
                  "2006": parseFloat(munVotes[0][2006]),
                  "2010": parseFloat(munVotes[0][2010]),
                  "2014": parseFloat(munVotes[0][2014]),
                  "2018": parseFloat(munVotes[0][2018])
                }, color: "#66BEE6", name: "Moderaterna"},
                {percent: {
                  "1994": parseFloat(munVotes[1][1994]),
                  "1998": parseFloat(munVotes[1][1998]),
                  "2002": parseFloat(munVotes[1][2002]),
                  "2006": parseFloat(munVotes[1][2006]),
                  "2010": parseFloat(munVotes[1][2010]),
                  "2014": parseFloat(munVotes[1][2014]),
                  "2018": parseFloat(munVotes[1][2018])
                }, color: "#63A91D", name: "Centerpartiet"},
                {percent: {
                  "1994": parseFloat(munVotes[2][1994]),
                  "1998": parseFloat(munVotes[2][1998]),
                  "2002": parseFloat(munVotes[2][2002]),
                  "2006": parseFloat(munVotes[2][2006]),
                  "2010": parseFloat(munVotes[2][2010]),
                  "2014": parseFloat(munVotes[2][2014]),
                  "2018": parseFloat(munVotes[2][2018])
                }, color: "#3399FF", name: "Liberalerna"},
                {percent: {
                  "1994": parseFloat(munVotes[3][1994]),
                  "1998": parseFloat(munVotes[3][1998]),
                  "2002": parseFloat(munVotes[3][2002]),
                  "2006": parseFloat(munVotes[3][2006]),
                  "2010": parseFloat(munVotes[3][2010]),
                  "2014": parseFloat(munVotes[3][2014]),
                  "2018": parseFloat(munVotes[3][2018])
                }, color: "#1B5CB1", name: "Kristdemokraterna"},
                {percent: {
                  "1994": parseFloat(munVotes[4][1994]),
                  "1998": parseFloat(munVotes[4][1998]),
                  "2002": parseFloat(munVotes[4][2002]),
                  "2006": parseFloat(munVotes[4][2006]),
                  "2010": parseFloat(munVotes[4][2010]),
                  "2014": parseFloat(munVotes[4][2014]),
                  "2018": parseFloat(munVotes[4][2018])
                }, color: "#008000", name: "Miljöpartiet"},
                {percent: {
                  "1994": parseFloat(munVotes[5][1994]),
                  "1998": parseFloat(munVotes[5][1998]),
                  "2002": parseFloat(munVotes[5][2002]),
                  "2006": parseFloat(munVotes[5][2006]),
                  "2010": parseFloat(munVotes[5][2010]),
                  "2014": parseFloat(munVotes[5][2014]),
                  "2018": parseFloat(munVotes[5][2018])
                }, color: "#FF0000", name: "Socialdemokraterna"},
                {percent: {
                  "1994": parseFloat(munVotes[6][1994]),
                  "1998": parseFloat(munVotes[6][1998]),
                  "2002": parseFloat(munVotes[6][2002]),
                  "2006": parseFloat(munVotes[6][2006]),
                  "2010": parseFloat(munVotes[6][2010]),
                  "2014": parseFloat(munVotes[6][2014]),
                  "2018": parseFloat(munVotes[6][2018])
                }, color: "#C40000", name: "Vänsterpartiet"},
                {percent: {
                  "1994": parseFloat(munVotes[7][1994]),
                  "1998": parseFloat(munVotes[7][1998]),
                  "2002": parseFloat(munVotes[7][2002]),
                  "2006": parseFloat(munVotes[7][2006]),
                  "2010": parseFloat(munVotes[7][2010]),
                  "2014": parseFloat(munVotes[7][2014]),
                  "2018": parseFloat(munVotes[7][2018])
                }, color: "#4E83A3", name: "Sverigedemokraterna"},
                {percent: {
                  "1994": parseFloat(munVotes[8][1994]),
                  "1998": parseFloat(munVotes[8][1998]),
                  "2002": parseFloat(munVotes[8][2002]),
                  "2006": parseFloat(munVotes[8][2006]),
                  "2010": parseFloat(munVotes[8][2010]),
                  "2014": parseFloat(munVotes[8][2014]),
                  "2018": parseFloat(munVotes[8][2018])
                }, color: "#ccc", name: "Annat"}
              ];

              /*--------- Inserting immigrant data ------------*/
              let index2 = data2.findIndex(i => i.Kommun.toLowerCase() == item.Kommun.toLowerCase());
              //console.log(index3);
              if(index2 != -1) {
                item["Asylsökande 2018"] = parseInt(data2[index2].Mottagna);
              }
            });

            self.data = data;
            console.log("data", data);

            drawStackedBar();
            drawBar();
          });
        });
      });
    });

    function drawBar(kommunnamn = "Danderyd") {
        //flush old graph
        svg1.selectAll(".bar").remove();
        svg1.selectAll(".line").remove();
        svg1.selectAll(".axis").remove();

        let regionToDraw = self.data.find( x => x.Kommun === kommunnamn);

        let max = 0;
        let dataFormat = regionToDraw.Riksdagsval.map((d) => {
          let arr = [];
          for(let k = 1994; k <= 2018; k+=4) {
            if(k === 2018) {
              arr.push({x1: k, x2: k, y1: isNaN(d.percent[k]) ? 0 : d.percent[k], y2: isNaN(d.percent[k]) ? 0 : d.percent[k], color: d.color, name: d.name});
            }
            else {
              arr.push({x1: k, x2: k+4, y1: isNaN(d.percent[k]) ? 0 : d.percent[k], y2: isNaN(d.percent[k+4]) ? 0 : d.percent[k+4], color: d.color, name: d.name});
            }
            if(d.percent[k] > max) {
              max = d.percent[k];
            }
          }
          return arr;
        });

        y1.domain([0, max])
          .nice();

        // Add x axis and title.
        svg1.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height1 + ")")
            .call(xAxis1)
            .append("text")
            .attr("class", "label")
            .attr("x", width1/2)
            .attr("y", 40)
            .style("text-anchor", "middle")
            .text("Rösttrend i " + kommunnamn);

        // Add y axis and title.
        svg1.append("g")
            .attr("class", "y axis")
            .call(yAxis1)
            .append("text")
            .attr("class", "label")
            .attr("y", -60)
            .attr("x", -height1/2)
            .attr("transform", "rotate(-90)")
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("Andel röster i riksdagsvalet");

        // Add the lines.
        var layer = svg1.selectAll(".bar")
            .data(dataFormat)
            .enter().append("g")
            .attr("class", "bar")
            .style("cursor", "pointer");

        layer.selectAll(".lines")
            .data(function(d) { return d; })
            .enter().append("line")
            .attr("class", "line")
            .attr("x1", function(d) { return x1(d.x1); })//task size normalize
            .attr("x2", function(d) { return x1(d.x2); })//task size normalize
            .attr("y1", function(d) { return y1(d.y1); })
            .attr("y2", function(d) { return y1(d.y2); })
            .style("stroke", function(d) { return d.color; })
            .style("stroke-width", "2");

        layer.selectAll("myCircles")
                .data(function(d) { return d; })
                .enter().append("circle")
                .attr("fill", "red")
                .attr("stroke", "none")
                .attr("cx", function(d) { return x1(d.x1) })
                .attr("cy", function(d) { return y1(d.y1) })
                .attr("r", 4)
                .style("fill", function(d) { return d.color; })
                //tooltip
                .on("mousemove", function(d) {
                    tooltip1.transition()
                        .duration(200)
                        .style("opacity", .9);
                    var mouse = d3.mouse(svg1.node()).map( function(d) { return parseInt(d); } );
                    tooltip1
                        .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
                        .html(d.name + " | " + d.y1 + "%");
                })
                .on("mouseout", function(d) {
                    tooltip1.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
    }

    function drawStackedBar(cid = 1) {
        //flush old graph
        svg2.selectAll(".stack").remove();
        svg2.selectAll(".axis").remove();

        let regionToDraw = self.data.filter( x => x.Länskod === cid);

        //define the domain of the stacked bar graph
        var dataIntermediate = format.map((item, i) => {
          return regionToDraw.map((d) => {
            return {x: d.Kommun, y: Math.round(d.Riksdagsval[i].percent[2018] * 10) / 10, color: d.Riksdagsval[i].color, party: item, name: d.Riksdagsval[i].name};
          });
        });

        var dataStackLayout = d3.layout.stack()(dataIntermediate);

        x2.domain(dataStackLayout[0].map(
          function (d) {
            return d.x;
          })
        );

        y2.domain([0,
          d3.max(dataStackLayout[dataStackLayout.length - 1],
            function(d) { return d.y0 + d.y;})
          ])
          .nice();

        // Add x axis and title.
        svg2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2)
            .append("text")
            .attr("x", width2/2)
            .attr("y", -height2 - 20)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Riksdagsvalet 2018 per kommun i " + regionToDraw[0]["Län"]);

        svg2.select(".x.axis")
            .selectAll(".tick.major")
            .selectAll("text")
            .attr("transform"," translate(-5,5) rotate(-40)")
            .style("font-size","14px")
            .style("text-anchor", "end");

        //draw bars
        var layer = svg2.selectAll(".stack")
            .data(dataStackLayout)
            .enter().append("g")
            .attr("class", "stack")
            .style("cursor", "pointer");

        layer.selectAll(".stackedbar")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("class", "stackedbar")
            .attr("x", function(d) { return x2(d.x); })
            .attr("y", function (d) { return y2(d.y + d.y0); })
            .attr("height", function (d) { return y2(d.y0) - y2(d.y + d.y0); })
            .attr("width", x2.rangeBand())
            .style("fill", function(d) { return d.color; }) // task color
            .style("opacity", "0.7")
            //tooltip
            .on("mousemove", function(d) {
                tooltip2.transition()
                    .duration(200)
                    .style("opacity", .9);
                var mouse = d3.mouse(svg2.node()).map( function(d) { return parseInt(d); } );
                tooltip2
                    .attr("style", "left:"+(mouse[0]+50)+"px;top:"+(mouse[1]+60)+"px")
                    .html(d.name + " | " + d.y + "%");
            })
            .on("mouseout", function(d) {
                tooltip2.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function(d) {
                drawBar(d.x);
            });

        layer.selectAll(".text")
      	  .data(function (d) { return d; })
      	  .enter().append("text")
      	  .attr("x", function(d) { return x2(d.x) + x2.rangeBand() / 2; })
      	  .attr("y", function(d) { return y2(d.y/2 + d.y0) - 4; })
      	  .attr("dy", ".75em")
          .style("text-anchor", "middle")
          .style("font-size", "10px")
          .style("user-select", "none")
          .style("color", "#fff")
      	  .html(function(d) { return d.y + "%"; })
          //tooltip
          .on("mousemove", function(d) {
              tooltip2.transition()
                  .duration(200)
                  .style("opacity", .9);
              var mouse = d3.mouse(svg2.node()).map( function(d) { return parseInt(d); } );
              tooltip2
                  .attr("style", "left:"+(mouse[0]+50)+"px;top:"+(mouse[1]+60)+"px")
                  .html(d.name + " | " + d.y + "%");
          })
          .on("mouseout", function(d) {
              tooltip2.transition()
                  .duration(500)
                  .style("opacity", 0);
          })
          .on("click", function(d) {
              drawBar(d.x);
          });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value) {
        var county = self.data.find(i  => i.Län === value);

        drawBar(county.Kommun);
        drawStackedBar(county.Länskod);

        var dt1 = d3.select("#bar");
        dt1.selectAll(".bar")
            .style("stroke", (d) => d["Länskod"] == county.Länskod ? null : "#fff" );

        var dt2 = d3.select("#stackedbar");
        dt2.selectAll(".stackedbar")
            .style("stroke", (d) => d["Länskod"] == county.Länskod ? null : "#fff");
    };
}
