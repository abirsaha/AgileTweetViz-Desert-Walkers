/**
 * Created by Manohara Rao Penumala on 11/3/2015.
 */
tweetApp.directive('geoChart',['$parse', '$window', function($parse, $window) {
    return {
        restrict: 'EA',
        template: "<svg></svg>",
        link: function (scope, elem, attrs) {
            var margin = {top: 10, right: 50, bottom: 25, left: 60};
            var padding = 0;

            // canvas resolution
            var width = 1600,
                height = 700;

            //getting d3 window in d3
            var d3 = $window.d3;

            //looking for svg element in html
            var rawSvg = elem.find('svg');

            // defines "svg" as data type and "make canvas" command
            var svg = d3.select(rawSvg[0])
                .call(d3.behavior.zoom()
                    .on("zoom", redraw))
                .attr("width", width)
                .attr("height", height);

            // projection-settings for mercator
            var projection = d3.geo.mercator()
                            .scale(100)
                            .center([10, 50])
                            .precision(0);

            // group the svg layers
            var g = svg.append("g").attr("class", "mappath");

            // defines "path" as return of geographic features
            var path = d3.geo.path()
                .projection(projection);

            // load data and display the map on the canvas with country geometries
            d3.json("https://gist.githubusercontent.com/d3noob/5193723/raw/world-110m2.json", function (error, topology) {
                g.selectAll("path")
                    .data(topojson.object(topology, topology.objects.countries)
                        .geometries)
                    .enter()
                    .append("path")
                    .attr("d", path)
            });

            aa = [-122.490402, 37.786453];
            bb = [-122.389809, 37.72728];

            function shower() {
                svg.append("circle")
                    .attr("cx", 600)
                        .attr("cy", 300)
                            .attr("r", 1)
                            .attr("class", "circlestyle")
                            .style("fill", "green")
                            .style("fill-opacity", 0.5)
                            .style("stroke", "red")
                            .style("stroke-opacity", 0.5)
                            .transition()
                            .duration(2000)
                            .ease(Math.sqrt)
                            .attr("r", 20)
                            .attr("class", "circlestyle")
                            .style("fill-opacity", 1e-6)
                            .style("stroke-opacity", 1e-6)
                            .remove()
                setTimeout(shower, 200);
            }

            shower();

            function redraw() {
                svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }
        }
    }
}]);
