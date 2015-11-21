tweetApp.directive('linearChart',['$parse', '$window', function($parse, $window){
    return{
        restrict:'EA',
        template:"<svg></svg>",
        link: function(scope, elem, attrs){
            var margin = {top:10, right: 50, bottom: 25, left: 20};
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

            //making d3.tip function for d3-tip
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function(d) {
                    return  "Minutes: "+d.x+",<br>"+" Tweet Count: "+ d.y;
                });

            //setting values for initial dimensions of svg element
            //taking rawSvg in d3 context
            var svg = d3.select(rawSvg[0])
                .attr('width', width)
                .attr('height', height)
                .attr('id', 'lchart');

            //calling tip to append it to svg element
            svg.call(tip);

            //checking for resize on window element if it happens then draw
            // the new graph using same aspect ratio call redrawLineChart()
            angular.element($window).on('resize',function(){
                var the_chart = $("#viz"),
                    container = the_chart;
                //var aspect = $("#lchart").attr("width")/$("#lchart").attr("height");
                var targetWidth = (container[0].offsetWidth);
                var new_chart = $("#lchart");
                new_chart.attr("width", targetWidth);
                //new_chart.attr("height", targetWidth/aspect);
                redrawLineChart();
            });

            function setChartParameters(){

                //.scale to set scaling for the axis
                // .linear tell the linear behaviour of the axis
                // .domain sets min and max value along the axis
                // .range to set width or height of the axis plotted
                xScale = d3.scale.linear()
                    .domain([scope.retTotal[0].x, scope.retTotal[scope.retTotal.length-1].x])
                    .range([0, $("#viz")[0].offsetWidth - margin.right -margin.left]);

                yScale = d3.scale.linear()
                    .domain([0, d3.max(scope.retTotal, function (d) {
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
                    .interpolate("linear");
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
                    .text("-- minutes -->");

                svg.append("svg:g")
                    .attr("class", "y axis")
                    .attr("transform", "translate("+margin.left+","+margin.top+")")
                    .call(yAxisGen)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", margin.top)
                    .style("text-anchor", "end")
                    .text("-- tweet count -->");

                svg.append("svg:path")
                    .attr({
                        d: lineFun(scope.retTotal),
                        "stroke": "green",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "totalline"
                    });

                svg.append("svg:path")
                    .attr({
                        d: lineFun(scope.retFemale),
                        "stroke": "red",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "femaleline"
                    })
                    .style({
                        opacity:0
                    });
                svg.append("svg:path")
                    .attr({
                        d: lineFun(scope.retMale),
                        "stroke": "blue",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "maleline"
                    })
                    .style({
                        opacity:0
                    });

                svg.append("svg:path")
                    .attr({
                        d: lineFun(scope.retPos),
                        "stroke": "blue",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "posline"
                    })
                    .style({
                        opacity:0
                    });
                svg.append("svg:path")
                    .attr({
                        d: lineFun(scope.retNeg),
                        "stroke": "black",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "negline"
                    })
                    .style({
                        opacity:0
                    });
                svg.append("svg:path")
                    .attr({
                        d: lineFun(scope.retNeu),
                        "stroke": "red",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "neuline"
                    })
                    .style({
                        opacity:0
                    });

                svg.selectAll("dot")
                    .data(scope.retTotal)
                    .enter()
                    .append("circle").attr("r",3)
                    .attr("cx", function(d){
                        return xScale(d.x)+margin.left})
                    .attr("cy",function(d){return yScale(d.y)+margin.top})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
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
                svg.selectAll("#totalline")
                    .attr({
                        d: lineFun(scope.retTotal)
                    });
                svg.selectAll("#maleline")
                    .attr({
                        d: lineFun(scope.retMale)
                    });
                svg.selectAll("#femaleline")
                    .attr({
                        d: lineFun(scope.retFemale)
                    });
                svg.selectAll("#posline")
                    .attr({
                        d: lineFun(scope.retPos)
                    });
                svg.selectAll("#negline")
                    .attr({
                        d: lineFun(scope.retNeg)
                    });
                svg.selectAll("#neuline")
                    .attr({
                        d: lineFun(scope.retNeu)
                    });
            }

            scope.retTotal = [];
            scope.retMale = [];
            scope.retFemale = [];
            scope.retPos = [];
            scope.retNeg =[];
            scope.retNeu = [];
            var line_data = function (data) {

                /* Sorting the JSON Data*/

                data.sort(function (a, b) {
                    return a.minutes - b.minutes;
                });
                var total = [];
                var y_val = 0;
                angular.forEach(data, function (d,i) {
                    y_val = d.value;
                    this.push({"x": d.minutes, "y": y_val, "z": d.gender, "w": d.sentiment});
                },total);
                if (total.length != 0) {
                    var tempX = total[0].x;
                    var totalY = 0;
                    var maleY = 0;
                    var femaleY = 0;
                    var posY = 0;
                    var negY = 0;
                    var neuY = 0;
                    angular.forEach(total, function (d,i) {
                        if (tempX == d.x) {
                            totalY = totalY + d.y;
                            if (d.z == "male"){
                                maleY = maleY + d.y
                            }
                            else{
                                femaleY = femaleY + d.y
                            }
                            if (d.w == "1"){
                                posY = posY + d.y
                            }
                            else if (d.w == "2"){
                                negY = negY + d.y
                            }
                            else{
                                neuY = neuY + d.y
                            }
                        }
                        else {
                            this.push({"x": tempX, "y": totalY});
                            scope.retMale.push({"x": tempX, "y": maleY});
                            scope.retFemale.push({"x": tempX, "y": femaleY});
                            scope.retPos.push({"x": tempX, "y": posY});
                            scope.retNeg.push({"x": tempX, "y": negY});
                            scope.retNeu.push({"x": tempX, "y": neuY});
                            totalY = d.y;
                            if (d.z == "male"){
                                maleY = d.y;
                                femaleY = 0;
                            }
                            else{
                                femaleY = d.y;
                                maleY = 0;
                            }
                            if (d.w == "1"){
                                posY = d.y;
                                negY = 0;
                                neuY = 0;
                            }
                            else if (d.w == "2"){
                                negY = d.y;
                                posY = 0;
                                neuY = 0;
                            }
                            else{
                                neuY = d.y;
                                posY = 0;
                                negY = 0;
                            }
                            tempX = d.x;
                        }
                        if(i==(total.length-1)){
                            if (this.length<1){
                                this.push({"x": tempX-2, "y": 0});
                                this.push({"x": tempX-1, "y": 0});
                                this.push({"x": tempX, "y": totalY});
                                this.push({"x": tempX+1, "y": 0});
                                this.push({"x": tempX+2, "y": 0});

                                scope.retMale.push({"x": tempX-2, "y": 0});
                                scope.retMale.push({"x": tempX-1, "y": 0});
                                scope.retMale.push({"x": tempX, "y": maleY});
                                scope.retMale.push({"x": tempX+1, "y": 0});
                                scope.retMale.push({"x": tempX+2, "y": 0});

                                scope.retFemale.push({"x": tempX-2, "y": 0});
                                scope.retFemale.push({"x": tempX-1, "y": 0});
                                scope.retFemale.push({"x": tempX, "y": femaleY});
                                scope.retFemale.push({"x": tempX+1, "y": 0});
                                scope.retFemale.push({"x": tempX+2, "y": 0});

                                scope.retPos.push({"x": tempX-2, "y": 0});
                                scope.retPos.push({"x": tempX-1, "y": 0});
                                scope.retPos.push({"x": tempX, "y": posY});
                                scope.retPos.push({"x": tempX+1, "y": 0});
                                scope.retPos.push({"x": tempX+2, "y": 0});

                                scope.retNeg.push({"x": tempX-2, "y": 0});
                                scope.retNeg.push({"x": tempX-1, "y": 0});
                                scope.retNeg.push({"x": tempX, "y": negY});
                                scope.retNeg.push({"x": tempX+1, "y": 0});
                                scope.retNeg.push({"x": tempX+2, "y": 0});

                                scope.retNeu.push({"x": tempX-2, "y": 0});
                                scope.retNeu.push({"x": tempX-1, "y": 0});
                                scope.retNeu.push({"x": tempX, "y": neuY});
                                scope.retNeu.push({"x": tempX+1, "y": 0});
                                scope.retNeu.push({"x": tempX+2, "y": 0});
                            }
                            else{
                                this.push({"x": tempX, "y": totalY});
                                scope.retMale.push({"x": tempX, "y": maleY});
                                scope.retFemale.push({"x": tempX, "y": femaleY});
                                scope.retPos.push({"x": tempX, "y": posY});
                                scope.retNeg.push({"x": tempX, "y": negY});
                                scope.retNeu.push({"x": tempX, "y": neuY});
                            }
                        }
                    },scope.retTotal)
                }
            };
            line_data(scope.tweets);
            drawLineChart();
        }
    };
}]);