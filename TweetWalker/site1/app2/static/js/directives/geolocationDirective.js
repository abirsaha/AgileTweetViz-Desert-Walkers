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

            // projection-settings for mercator
            var projection = d3.geo.mercator()
                            .center([10, 50 ])
                            .scale(100);

            //looking for svg element in html
            var rawSvg = elem.find('svg');

            // defines "svg" as data type and "make canvas" command
            var svg = d3.select(rawSvg[0])
                .attr("width", width)
                .attr("height", height);

            // defines "path" as return of geographic features
            var path = d3.geo.path()
                .projection(projection);

            // group the svg layers
            var g = svg.append("g");

            // load data and display the map on the canvas with country geometries
            d3.json("https://gist.githubusercontent.com/d3noob/5193723/raw/world-110m2.json", function (error, topology) {
                g.selectAll("path")
                    .data(topojson.object(topology, topology.objects.countries)
                        .geometries)
                    .enter()
                    .append("path")
                    .attr("d", path)
            });
        }
    }
}]);
