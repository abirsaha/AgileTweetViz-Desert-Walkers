
/**
 * Created by Abir on 10/15/15.
 */
tweetApp.directive('genChart',['$parse', '$window', function($parse, $window){

    return{
        restrict:'EA',
        template:"<svg></svg>",
        link: function(scope, elem, attrs){
            var margin = {top:10, right: 50, bottom: 25, left: 60};
            var padding = 0;
            width = $("#viz")[0].offsetWidth,
                height = $("#viz")[0].offsetHeight-123;

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
            //var data_m=exp(scope);
            
            var rawdata = scope.tweets;
            var dict = {};
            for(var i=0;i<rawdata.length;i++){
            var obj = rawdata[i];
            if (!(obj["minutes"] in dict)){
                var arr = [0,0]
                dict[obj["minutes"]] = arr;
            }
            if (obj["gender"] == "male")
                dict[obj["minutes"]][0]++;   
            else
                dict[obj["minutes"]][1]++;
        }
             
        var data_m = [];
        var data_f = [];
        for (key in dict){
            if (dict.hasOwnProperty(key)) {
                data_m.push({"x": key, "y": dict[key][0]});
                data_f.push({"x": key, "y": dict[key][1]});
            }
        }
        
            
            //making d3.tip function for d3-tip
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function(d) {
                    return  attrs.xaxisLabel+": "+d.x+",<br>"+attrs.yaxisLabel+": "+ d.y;
                });

            //setting values for initial dimensions of svg element
            //taking rawSvg in d3 context
            var svg = d3.select(rawSvg[0])
                .attr('width', width)
                .attr('height', height)
                .attr('id', 'lchart');

            //calling tip to append it to svg element
            svg.call(tip);

            //dynamic rendering for chart for any change in values
            /*scope.$watchCollection(exp, function(newVal, oldVal){
                data_m=newVal;
                redrawLineChart();
            });*/

            //checking for resize on window element if it happens then draw
            // the new graph using same aspect ratio call redrawLineChart()
            /*angular.element($window).on('resize',function(){
                var the_chart = $("#viz"),
                    container = the_chart;
                var aspect = $("#gchart").attr("width")/$("#gchart").attr("height");
                var targetWidth = (container[0].offsetWidth);
                var new_chart = $("#gchart");
                new_chart.attr("width", targetWidth);
                new_chart.attr("height", targetWidth/aspect);
                redrawLineChart();

            });
            */
            function setChartParameters(){

                //.scale to set scaling for the axis
                // .linear tell the linear behaviour of the axis
                // .domain sets min and max value along the axis
                 // .range to set width or height of the axis plotted
                xScale = d3.scale.linear()
                    .domain([data_m[0].x, data_m[data_m.length-1].x])
                    .range([0, $("#viz")[0].offsetWidth - margin.right -margin.left]);

                yScale = d3.scale.linear()
                    .domain([0, d3.max(data_m, function (d) {
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
                        return xScale(d.x)+margin.left;
                    })
                    .y(function (d) {
                        return yScale(d.y)+margin.top;
                    })
                    .interpolate("basis");
            }

            function drawLineChart() {
                //call setChartParameters() function to set variables with values
                setChartParameters();

                //append svg:g i.e. svg graph element to svg
                // next 2 .attr addinging x axis to graph followed by calling xAxisGen
                // to created x axis, appended text to axis following are setting
                // parameters to text
                svg.append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate("+margin.left+","+ parseInt($("#viz")[0].offsetHeight-123-margin.bottom) +")")
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
                        .attr("y", margin.top)
                        .style("text-anchor", "end")
                        .text("-- " + "Count" + "-->");

                svg.append("svg:path")
                    .attr({
                        d: lineFun(data_m),
                        "stroke": "blue",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass
                    })
                svg.append("svg:path")
                    .attr({
                        d: lineFun(data_f),
                        "stroke": "red",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass
                    })
                /*
                svg.selectAll("dot")
                    .data(data_m)
                    .enter()
                    .append("circle").attr("r",5)
                    .attr("cx", function(d){
                        return xScale(d.x)+margin.left})
                    .attr("cy",function(d){return yScale(d.y)+margin.top})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);*/
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
                    .attr("transform", "translate("+margin.left+","+ parseInt($("#lchart").attr("height")-margin.bottom) +")")
                    .call(xAxisGen);

                //regenerate dots on line chart
                svg.selectAll("circle")
                    .attr("cx", function(d){return xScale(d.x)+margin.left})
                    .attr("cy",function(d){return yScale(d.y)+margin.top});

                //regenerate line on line chart
                svg.selectAll("."+pathClass)
                    .attr({
                        d: lineFun(data_m)
                    });
            }

            drawLineChart();
        }
    };
}])