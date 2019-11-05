function map(){

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;
    //initialize color scale
    var color = d3.scale.category20c();

    //initialize tooltip
    var tooltip = d3.select("#map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var projection = d3.geo.mercator()
        .center([20, 64])
        .scale(1100);
    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var path = d3.geo.path()
        .projection(projection);

    g = svg.append("g");

    // load data and draw the map
    d3.json("data/se-counties.json", function(error, sweden) {

        var regions = topojson.feature(sweden, sweden.objects.SWE_adm1).features;

        //load summary data
        d3.csv("data/socialScience.csv", function(error, data) {
            draw(regions,data);
        });

    });

    function draw(regions,data)
    {

        var region = g.selectAll(".region").data(regions);

        var cc = [];

        regions.forEach(function (d) {
            //console.log(d);
            //console.log(d.properties.NAME_1);
            let i = d.properties.NAME_1
            cc[i] = color(i);
            //console.log(cc[d["Region"]]);
        });


        region.enter().insert("path")
            .attr("class", "region")
            .attr("d", path)
            .attr("id", function(d) { return d.properties.ID_1; })
            .attr("title", function(d) { return d.properties.NAME_1; })
            //.attr("class",function(d) { return "country " + d.properties.name; }));
            //.style("fill", function(d) { return color(d.properties.name); }) // task color
            //return color(d[cValue])
            .style("fill", function(d) { return cc[d.properties.NAME_1]; }) // task color
            .style("cursor", "pointer")
            //tooltip
            .on("mousemove", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
                tooltip
                  .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
                  .html(d.properties.NAME_1);
            })
            .on("mouseout",  function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            //selection
            .on("click",  function(d) {
                selFeature(d);
            });
    }

    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    //method for selecting features of other components
    function selFeature(value){
        bar.selectDot(value.properties.NAME_1);
    }
}
