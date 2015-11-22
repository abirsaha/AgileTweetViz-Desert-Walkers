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
            var width = 1000,
                height = 1200;

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
                            .center([0, 50])
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
            
            var ws;
            var str = "ws://" + "52.34.48.18" + ":" + "8888" + "/ws";
            ws = new WebSocket(str);
            //document.write(ws);


            function shower(data) {
                //console.log(data['latitude']);
                //console.log(data['longitude']);
                svg.append("circle")
                    .attr("r", 1)
                    .attr("class", "circlestyle")
                    .attr("transform", function(d) {
                            //console.log(data);
                            //return "translate(" + projection([num.toString(d['longitude']),num.toString(d['latitude'])]) + ")";
                            var  longitude= (data['latitude'].toFixed(2)).toString();
                            var latitude  = (data['longitude'].toFixed(2)).toString();
                            
                            return "translate(" + projection([latitude,longitude]) + ")";
                        }
                        )
                    .style("fill", "yellow")
                    .style("fill-opacity", 0.10)
                    .style("stroke", "orange")
                    .style("stroke-opacity", 0.5)
                    .transition()
                    .duration(10000)
                    .ease(Math.sqrt)
                    .attr("r", 20)
                    .attr("class", "circlestyle")
            }

            

            function redraw() {
                svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }
            ws.onmessage = function(evt) {
                
                shower($.parseJSON(evt.data));
            //document.write("Message Received: " + evt.data)
            };
            shower();
        }
    }
}]);
