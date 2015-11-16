/**
 * Created by ayushgupta on 15/11/15.
 */

tweetApp.directive('tweetcountDirective',['$parse', '$window', function($parse, $window) {

    return {
        restrict: 'EA',
        template: "<svg></svg>",
        link: function (scope, elem, attrs) {
            var rawdata = scope.tweets;
            var rawsvg = elem.find("svg");
            var tweetcount = rawdata.length;

            var svg = d3.select(rawsvg[0])
                .attr("width", 100)
                .attr("height", 100);

            var gauge = iopctrl.arcslider()
                .radius(30)
                .events(false)
                .indicator(iopctrl.defaultGaugeIndicator);

            gauge.axis().orient("in")
                .normalize(true)
                .ticks(12)
                .tickSubdivide(3)
                .tickSize(10, 8, 10)
                .tickPadding(5)
                .scale(d3.scale.linear()
                        .domain([0, tweetcount])
                        .range([-3*Math.PI/4, 3*Math.PI/4]));

            var segDisplay = iopctrl.segdisplay()
                .width(80)
                .digitCount(6)
                .negative(false)
                .decimals(0);

            svg.append("g")
                .attr("class", "segdisplay")
                .attr("transform", "translate(130, 200)")
                .call(segDisplay);

            svg.append("g")
                .attr("class", "gauge")
                .call(gauge);

            segDisplay.value(tweetcount);
            gauge.value(tweetcount);

                   }
    };
}]);
