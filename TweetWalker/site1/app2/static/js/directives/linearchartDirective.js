tweetApp.directive('linearChart', function($parse, $window){
    return{
        restrict:'EA',
        template:"<svg></svg>",
        link: function(scope, elem, attrs){
            var margin = {top:10, right: 50, bottom: 25, left: 50};
            var padding = 0;
            width = $("#linechart")[0].offsetWidth,
                height = $("#linechart")[0].offsetHeight;

            //defining axis variables
            var pathClass="path";

            var xScale, yScale, xAxisGen, yAxisGen, lineFun;
            //getting d3 window in d3
            var d3 = $window.d3;

            //looking for svg element in html
            var rawSvg=elem.find('svg');

            //fetching data to plot here in chartData, it uses camel case
            // for angularJS so we get plotData in chartData(or chart-data)
            //setting parameters for axises
            var exp = $parse(attrs.chartData);
            var dataToPlot=exp(scope);

            //setting values for initial dimensions of svg element
            //taking rawSvg in d3 context
            var svg = d3.select(rawSvg[0])
                .attr('width', width)
                .attr('height', height)
                .attr('id', 'lchart');

            var div = svg.append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            //dynamic rendering for chart for any change in values
            scope.$watchCollection(exp, function(newVal, oldVal){
                dataToPlot=newVal;
                redrawLineChart();
            });

            //checking for resize on window element if it happens then draw
            // the new graph using same aspect ratio call redrawLineChart()
            angular.element($window).on('resize',function(){
                var the_chart = $("#lchart"),
                    aspect = the_chart[0].offsetWidth / the_chart[0].offsetHeight,
                    container = the_chart.parent();
                var targetWidth = (container[0].offsetWidth);
                //console.log("new width is",the_chart);
                //console.log("new width is",the_chart[0]);
                the_chart.attr("width", targetWidth);
                the_chart.attr("height", Math.round(targetWidth / aspect));
                redrawLineChart();
            });
            function setChartParameters(){

                //.scale to set scaling for the axis
                // .linear tell the linear behaviour of the axis
                // .domain sets min and max value along the axis
                // .range to set width or height of the axis plotted
                xScale = d3.scale.linear()
                    .domain([dataToPlot[0].x, dataToPlot[dataToPlot.length-1].x])
                    .range([0, $("#lchart").attr("width") - margin.right -margin.left]);

                yScale = d3.scale.linear()
                    .domain([0, d3.max(dataToPlot, function (d) {
                        return d.y;
                    })])
                    .range([$("#lchart").attr("height")-margin.bottom-margin.top, 0]);
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
                        //console.log("x is", d.x)
                        return xScale(d.x)+50;
                    })
                    .y(function (d) {
                        //console.log("y is", d.y)
                        return yScale(d.y)+10;
                    })
                    .interpolate("linear");
            }

            //var x = d3.scale(xScale).linear.range([0, width]);
            //var y = d3.scale().linear().range([height, 0]);

            function drawLineChart() {
                //call setChartParameters() function to set variables with values
                setChartParameters();

                //append svg:g i.e. svg graph to element svg
                // next 2 .attr addinging x axis to graph followed by calling xAxisGen
                // to created x axis, appended text to axis following are setting
                // parameters to text
                svg.append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate("+margin.left+","+ parseInt($("#lchart").attr('height')-margin.bottom) +")")
                        .call(xAxisGen)
                    .append("text")
                        .attr("x", margin.left+margin.right)
                        //.attr("dx", ".71em")
                        .attr("y",margin.bottom)
                        .style("text-anchor", "middle")
                        .text("-- "+attrs.xaxisLabel+" -->");


                svg.append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate("+margin.left+","+margin.top+")")
                        .call(yAxisGen)
                    .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 10)
                        .style("text-anchor", "end")
                        .text("-- "+attrs.yaxisLabel+"-->");

                svg.append("svg:path")
                    .attr({
                        d: lineFun(dataToPlot),
                        "stroke": "blue",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass
                    })

                svg.selectAll("dot")
                    .data(dataToPlot)
                    .enter()
                    .append("circle").attr("r",5)
                    .attr("cx", function(d){return xScale(d.x)+50})
                    .attr("cy",function(d){return yScale(d.y)+10})
                    .on("mouseover", function(d) {
                        console.log("values of d are:", d.x, d.y);
                        div.transition()
                            .duration(500)
                            .style("opacity", 2);
                        div	.html(d.x + "<br/>"  + d.y)
                            .style("display","block")
                            .style("left", function(d){return 500} + "px")
                            .style("top", function(d){return 100} + "px");
                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            }

            function redrawLineChart() {

                //reseting new chart parameters
                setChartParameters();

                //regenerating y axis by selecting it and then by calling
                // the function on it
                svg.selectAll("g.y.axis").call(yAxisGen);

                //regenerating x axis by selecting it and then by calling
                // the function on it also re transforming it
                svg.selectAll("g.x.axis")
                    .attr("transform", "translate("+margin.left+","+ parseInt($("#lchart").attr('height')-margin.bottom) +")")
                    .call(xAxisGen);

                //regenerate dots on line chart
                svg.selectAll("circle")
                    .attr("cx", function(d){return xScale(d.x)+50})
                    .attr("cy",function(d){return yScale(d.y)+10});

                //regenerate line on line chart
                svg.selectAll("."+pathClass)
                    .attr({
                        d: lineFun(dataToPlot)
                    });
            }

            drawLineChart();
        }
    };
});