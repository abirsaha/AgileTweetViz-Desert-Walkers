tweetApp.directive('linearChart', function($parse, $window){
    return{
        restrict:'EA',
        template:"<svg></svg>",
        link: function(scope, elem, attrs){

            //setting values for initial dimensions of svg element
            var margin = {top:10, right: 0, bottom: 10, left: 52};
            var padding = 20;
            width = $("#linechart")[0].offsetWidth-padding,
                height = $("#linechart")[0].offsetHeight-2*padding;

            //fetching data to plot here in chartData, it uses camel case
            // for angularJS so we get plotData in chartData(or chart-data)
            var exp = $parse(attrs.chartData);
            var dataToPlot=exp(scope);

            //defining axis variables
            var pathClass="path";
            var xScale, yScale, xAxisGen, yAxisGen, lineFun;

            //getting d3 window in d3
            var d3 = $window.d3;

            //looking for svg element in html
            var rawSvg=elem.find('svg');

            //making rawSvg in d3 context
            var svg = d3.select(rawSvg[0])
                .attr('width', width)
                .attr('height', height)
                .attr('id', 'lchart');

            //var a=$('#linechart');
            //console.log("w and h is:",elem.height,elem.width);
            //console.log("value is",a)
            //console.log("window is",$('#viz'))

            //dynamic rendering for chart for any change in values
            scope.$watchCollection(exp, function(newVal, oldVal){
                dataToPlot=newVal;
                redrawLineChart();
            });

            //setting parameters for axises
            function setChartParameters(){
                //.scale to set scaling for the axis
                // .linear tell the linear behaviour of the axis
                // .domain sets min and max value along the axis
                // .range to set width or height of the axis plotted

                xScale = d3.scale.linear()
                    .domain([dataToPlot[0].x, dataToPlot[dataToPlot.length-1].x])
                    .range([margin.left + padding, rawSvg.attr("width") - 2*padding]);
                yScale = d3.scale.linear()
                    .domain([0, d3.max(dataToPlot, function (d) {
                        return d.y;
                    })])
                    .range([rawSvg.attr("height") - padding, margin.bottom]);

                //draw x axis
                xAxisGen = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
                //draw y axis
                yAxisGen = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

                //draw the line
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
                //call setChartParameters() function to set variables with values
                setChartParameters();

                //append svg:g i.e. svg graph to element svg
                // next 2 .attr addinging x axis to graph followed by calling xAxisGen
                // to created x axis, appended text to axis following are setting
                // parameters to text
                svg.append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0,"+ parseInt(rawSvg.attr('height') - padding) +")")
                        .call(xAxisGen)
                    .append("text")
                        .attr("x", parseInt(rawSvg.attr('width'))-parseInt(padding))
                        //.attr("dx", ".71em")
                        .attr("y",-5)
                        .style("text-anchor", "end")
                        .text(attrs.xaxisLabel);


                svg.append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(70,0)")
                        .call(yAxisGen)
                    .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 10)
                        //.attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(attrs.yaxisLabel);

                svg.append("svg:path")
                    .attr({
                        d: lineFun(dataToPlot),
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
                        d: lineFun(dataToPlot)
                    });
            }


            function resize_linechart(){
                var the_chart = $("#lchart"),
                    aspect = the_chart[0].offsetWidth / the_chart[0].offsetHeight,
                    container = the_chart.parent();
                var targetWidth = (container[0].offsetWidth);
                //console.log("new width is",the_chart);
                //console.log("new width is",container[0].offsetHeight);
                the_chart.attr("width", targetWidth);
                the_chart.attr("height", Math.round(targetWidth / aspect));
            };

            drawLineChart();
            //resize_linechart();
        }
    };
});