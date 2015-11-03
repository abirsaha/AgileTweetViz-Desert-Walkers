/**
 * Created by nitingoel on 11/3/15.
 */
tweetApp.directive('circleChart',['$parse', '$window', function($parse, $window) {

    return {
        restrict: 'EA',
        template: "<svg></svg>",
        link: function (scope, elem, attrs) {
            console.log("in directive of circle")
            var diameter = 960,
                format = d3.format(",d");

            var pack = d3.layout.pack()
                .size([diameter - 4, diameter - 4])
                .value(function(d) { return d.size; });

            var rawSvg=elem.find('svg');

            var svg = d3.select(rawSvg[0])
                .attr("width", diameter)
                .attr("height", diameter)
                .append("g")
                .attr("transform", "translate(2,2)");

            d3.json("/static/data/flare.json", function(error, root) {
                if (error) throw error;
                console.log("error is",error)

                var node = svg.datum(root).selectAll(".node")
                    .data(pack.nodes)
                    .enter().append("g")
                    .attr("class", function(d) {
                        //console.log("child is",d.children);
                        return d.children ? "node" : "leaf node"; })
                    .attr("transform", function(d) {
                        console.log("transforming", d.x, d.y);
                        return "translate(" + d.x + "," + d.y + ")"; });

                node.append("title")
                    .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

                node.append("circle")
                    .attr("r", function(d) { return d.r; });

                node.filter(function(d) { return !d.children; }).append("text")
                    .attr("dy", ".3em")
                    .style("text-anchor", "middle")
                    .text(function(d) { return d.name.substring(0, d.r / 3); });
            });

            d3.select(self.frameElement).style("height", diameter + "px");
        }
    };
}]);
