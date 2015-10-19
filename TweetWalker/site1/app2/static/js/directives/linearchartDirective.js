/**
 * Created by Abir on 10/15/15.
 */
tweetApp.directive('linearChart', function($parse, $window){
    return{
        restrict:'EA',
        template:"<svg width='850' height='200'></svg>",
        link: function(scope, elem, attrs){
            var exp = $parse(attrs.chartData);

            var salesDataToPlot=exp(scope);
            var padding = 20;
            var pathClass="path";
            var xScale, yScale, xAxisGen, yAxisGen, lineFun;

            var d3 = $window.d3;
            var rawSvg=elem.find('svg');
            var svg = d3.select(rawSvg[0]);

            scope.$watchCollection(exp, function(newVal, oldVal){
                salesDataToPlot=newVal;
                redrawLineChart();
            });

            function setChartParameters(){

                xScale = d3.scale.linear()
                    .domain([salesDataToPlot[0].x, salesDataToPlot[salesDataToPlot.length-1].x])
                    .range([padding + 52, rawSvg.attr("width") - 2*padding]);

                yScale = d3.scale.linear()
                    .domain([0, d3.max(salesDataToPlot, function (d) {
                        return d.y;
                    })])
                    .range([rawSvg.attr("height") - padding, 10]);

                xAxisGen = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(60);
/*
                    .ticks(salesDataToPlot.length - 1);
*/

                yAxisGen = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(10);

                lineFun = d3.svg.line()
                    .x(function (d) {
                        return xScale(d.x);
                    })
                    .y(function (d) {
                        return yScale(d.y);
                    })
                    .interpolate("basis");
            }

            function drawLineChart() {

                setChartParameters();

                svg.append("svg:g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0,180)")
                    .call(xAxisGen)
                    .append("text")
               // .attr("transform", "rotate(-90)")
                .attr("x", 840)
                .attr("dx", ".71em")
                .attr("y",-5)
                .style("text-anchor", "end")
                .text("Minutes ");


                svg.append("svg:g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(70,0)")
                    .call(yAxisGen)
                    .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Tweet Counts ");

                svg.append("svg:path")
                    .attr({
                        d: lineFun(salesDataToPlot),
                        "stroke": "blue",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass
                    });
            }

            function redrawLineChart() {

                setChartParameters();

                svg.selectAll("g.y.axis").call(yAxisGen);

                svg.selectAll("g.x.axis").call(xAxisGen);

                svg.selectAll("."+pathClass)
                    .attr({
                        d: lineFun(salesDataToPlot)
                    });
            }

            drawLineChart();
        }
    };
});