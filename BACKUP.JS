// var t = [
// { name: "Stockholm", Länskod: 1},
// { name: "Uppsala", Länskod: 3},
// { name: "Södermanland", Länskod: 4},
// { name: "Östergötland", Länskod: 5},
// { name: "Jönköping", Länskod: 6},
// { name: "Kronoberg", Länskod: 7},
// { name: "Kalmar", Länskod: 8},
// { name: "Gotland", Länskod: 9},
// { name: "Blekinge", Länskod: 10},
// { name: "Skåne", Länskod: 12},
// { name: "Halland", Länskod: 13},
// { name: "Västra Götaland", Länskod: 14},
// { name: "Värmland", Länskod: 17},
// { name: "Örebro", Länskod: 18},
// { name: "Västmanland", Länskod: 19},
// { name: "Dalarna", Länskod: 20},
// { name: "Gävleborg", Länskod: 21},
// { name: "Västernorrland", Länskod: 22},
// { name: "Jämtland", Länskod: 23},
// { name: "Västerbotten", Länskod: 24},
// { name: "Norrbotten", Länskod: 25},
// ];

var yValue = "Kommunal skattesats";
var xValue = "Medelvärde förvärvsinkomst";
var cValue = "Kommun";
var sValue = "Folkmängd";

function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    var color = d3.scale.category20c();//color brewer

    var tooltip = d3.select("#sp").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // d3.csv("data/socialScience.csv", function(error, data) {
    //
    //
    //     //Beautify
    //     data.map(item => {
    //         item.Länskod = parseInt(item.Region.substr(0,2));
    //         item.Region = item.Region.substr(5);
    //     });
    //     //console.log(data);
    //     self.data = data;
    //
    //     //define the domain of the scatter plot
    //     x.domain(d3.extent(self.data, function(d) { return d[xValue]; })).nice();
    //     y.domain(d3.extent(self.data, function(d) { return d[yValue]; })).nice();
    //
    //     draw(xValue,yValue,cValue,sValue);
    //
    // });
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
          //console.log(data);
          var t = self.data.filter(x => x.Län== "Stockholms län");
          //console.log(t);
          //t.map(x => console.log(x.Kommun, x.Län, x.Länskod));

          //console.log("data", self.data);

          //user select


          //define the domain of the scatter plot
          x.domain(d3.extent(self.data, function(d) { return d[xValue]; })).nice();
          y.domain(d3.extent(self.data, function(d) { return d[yValue]; })).nice();

          draw(xValue,yValue,cValue,sValue);
        });
      });
    });

    function draw(xValue,yValue,cValue,sValue,cid = 1)
    {
        //flush old scatter
        svg.selectAll(".dot").remove();
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width-60)
            .attr("y", -6)
            .text(xValue);


        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("y", 6)
            .attr("x", -60)
            .attr("transform", "rotate(-90)")
            .attr("dy", ".71em")
            .text(yValue);


        // Add the scatter dots.
        let regionToDraw = self.data.filter( x => x.Länskod === cid);
        //console.log(regionToDraw);
        svg.selectAll(".dot")

            .data(regionToDraw)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function(d) { return d[sValue]/5000; })//task size normalize
            .attr("cx", function(d) { return x(d[xValue]); })
            .attr("cy", function(d) { return y(d[yValue]); })
            .style("fill", function(d) { return color(d[cValue]); }) // task color
            //tooltip
            .on("mousemove", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
                tooltip
                    .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
                    .html(d[cValue]);
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click",  function(d) {
                selFeature(d);
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){

        var cid = self.data.find(i  => i.Län === value).Länskod;

        draw(xValue,yValue,cValue,sValue,cid);
        var dt = d3.select("#sp");
        dt.selectAll(".dot")
            .style("stroke", function(d) { return d["Länskod"] == cid ? null
                : "#fff"; });
    };

    //method for selecting features of other components
    function selFeature(value){
        //console.log(value);
        //console.log(value);
        var dt = d3.select("#sp");
        dt.selectAll(".dot")
            .style("stroke", function(d) {console.log(d);return d["Länskod"] == value["Länskod"] ? null
                : "#fff"; });

    }

}
