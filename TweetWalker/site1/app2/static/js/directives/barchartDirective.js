/**
 * Created by nitingoel on 10/23/15.
 */
tweetApp.directive('barChart', function($parse, $window){
    return{
        restrict:'EA',
        template:"<svg></svg>",
        link: function(scope, elem, attrs){
            var margin = {top:10, right: 50, bottom: 25, left: 60};
            var tbarpadding = 50;
            width = $("#viz")[0].offsetWidth,
                height = $("#viz")[0].offsetHeight;
            //defining path and axis variables
            var barClass="bar";
            var xScale, yScale, xAxisGen, yAxisGen, barFun;

            //getting d3 window in d3
            var d3 = $window.d3;
            //looking for svg element in html
            var rawSvg=elem.find('svg');

            //fetching data to plot here in chartData, it uses camel case
            // for angularJS so we get plotData in chartData(or chart-data)
            //setting parameters for axises

            var exp = $parse(attrs.chartData);

            var dataToPlot=exp(scope);
            var a = angular.copy(dataToPlot);
            var ratio = a.sort(function (a, b) {
                return a.y - b.y;
            });
            var barwidth = function (w){
                return (width-tbarpadding-margin.left-margin.right)/dataToPlot[dataToPlot.length-1].x;
            }
            //ratio = a.max();
            //console.log("ratio is",ratio[ratio.length-1],height);
            ratio = (height-margin.top-margin.bottom)/ratio[ratio.length-1].y;
            //console.log("ratio is",ratio);

            //making d3.tip function for d3-tip
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function(d) {
                    return  d.x+","+ d.y;
                });

            //setting values for initial dimensions of svg element
            //taking rawSvg in d3 context
            var svg = d3.select(rawSvg[0])
                .attr('width', width)
                .attr('height', height)
                .attr('id', 'bchart');

            //calling tip to append it to svg element
            svg.call(tip);

            //dynamic rendering for chart for any change in values
            scope.$watchCollection(exp, function(newVal, oldVal){
                dataToPlot=newVal;
                redrawBarChart();
            });

            //checking for resize on window element if it happens then draw
            // the new graph using same aspect ratio call redrawBarChart()
            //angular.element($window).on('resize',function(){
            //    var the_chart = $("#bchart"),
            //        aspect = the_chart[0].offsetWidth / the_chart[0].offsetHeight,
            //        container = the_chart.parent();
            //    var targetWidth = (container[0].offsetWidth);
            //    the_chart.attr("width", targetWidth);
            //    the_chart.attr("height", Math.round(targetWidth / aspect));
            //    redrawBarChart();
            //});

            function setChartParameters(){

                //.scale to set scaling for the axis
                // .linear tell the linear behaviour of the axis
                // .domain sets min and max value along the axis
                // .range to set width or height of the axis plotted
                xScale = d3.scale.linear()
                    .domain([dataToPlot[0].x, dataToPlot[dataToPlot.length-1].x])
                    .range([0, $("#bchart").attr("width") - margin.right -margin.left]);

                yScale = d3.scale.linear()
                    .domain([0, d3.max(dataToPlot, function (d) {
                        return d.y;
                    })])
                    .range([$("#bchart").attr("height")-margin.bottom-margin.top, 0]);

                //draw x axis
                xAxisGen = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

                //draw y axis
                yAxisGen = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

                //draw the bar
                //barFun = d3.svg.line()
                //    .x(function (d) {
                //        return xScale(d.x)+50;
                //    })
                //    .y(function (d) {
                //        return yScale(d.y)+10;
                //    })
                //    .interpolate("linear");
            }

            function drawBarChart() {
                //call setChartParameters() function to set variables with values
                setChartParameters();

                //append svg:g i.e. svg graph element to svg
                // next 2 .attr addinging x axis to graph followed by calling xAxisGen
                // to created x axis, appended text to axis following are setting
                // parameters to text
                svg.append("svg:g")
                    .attr("class", "x axis")
                    .attr("transform", "translate("+margin.left+","+ parseInt($("#bchart").attr('height')-margin.bottom) +")")
                    .call(xAxisGen)
                    .append("text")
                    .attr("x", margin.left+margin.right)
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
                svg.selectAll(".bar")
                    .data(dataToPlot)
                    .enter()
                    .append("rect")
                    .attr("class", barClass)
                    .attr("x",function(d){
                        //console.log("xxxxxxx",dataToPlot.length,margin.left+(tbarpadding/dataToPlot.length)*d.x);
                        return margin.left-(barwidth($('#bchart').attr('width'))/2)+((tbarpadding/(dataToPlot.length-1))+barwidth($('#bchart').attr('width')))*d.x;})
                    .attr("width", barwidth($('#bchart').attr('width')))
                    .attr("y",function(d){return height-margin.bottom-(ratio* d.y);})
                    .attr("height", function(d){
                        //console.log("in func",ratio* d.y);
                        return ratio* d.y;})
                //svg.selectAll("dot")
                //    .data(dataToPlot)
                //    .enter()
                //    .append("circle").attr("r",1)
                //    .attr("cx", function(d){return xScale(d.x)+50})
                //    .attr("cy",function(d){return yScale(d.y)+10})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
            }

            function redrawBarChart() {

                //reseting new chart parameters
                setChartParameters();

                //regenerating y axis by selecting it and then by calling
                // the function on it
                svg.selectAll("g.y.axis").call(yAxisGen);

                //regenerating x axis by selecting it and then by calling
                // the function on it also re transforming it
                svg.selectAll("g.x.axis")
                    .attr("transform", "translate("+margin.left+","+ parseInt($("#bchart").attr('height')-margin.bottom) +")")
                    .call(xAxisGen);

                //regenerate dots on line chart
                svg.selectAll("circle")
                    .attr("cx", function(d){return xScale(d.x)+50})
                    .attr("cy",function(d){return yScale(d.y)+10});

                //regenerate line on line chart
                svg.selectAll("."+barClass)
                    .attr({
                        //d: barFun(dataToPlot)
                    });
            }

            drawBarChart();
        }
    };
});