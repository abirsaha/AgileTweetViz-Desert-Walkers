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

            //fetching data to plot here in chartData, it uses camel case
            // for angularJS so we get plotData in chartData(or chart-data)
            //setting parameters for axises
            var exp = $parse(attrs.chartData);
            var dataToPlot=exp(scope);

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

            //dynamic rendering for chart for any change in values
            scope.$watchCollection(exp, function(newVal, oldVal){
                dataToPlot=newVal;
                redrawLineChart();
            });

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
                    .domain([retTotal[0].x, retTotal[retTotal.length-1].x])
                    .range([0, $("#viz")[0].offsetWidth - margin.right -margin.left]);

                yScale = d3.scale.linear()
                    .domain([0, d3.max(retTotal, function (d) {
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
                        d: lineFun(retTotal),
                        "stroke": "green",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "totalline"
                    });

                svg.append("svg:path")
                    .attr({
                        d: lineFun(retFemale),
                        "stroke": "pink",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "femaleline"
                    });
                svg.append("svg:path")
                    .attr({
                        d: lineFun(retMale),
                        "stroke": "blue",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "maleline"
                    });

                svg.append("svg:path")
                    .attr({
                        d: lineFun(retPos),
                        "stroke": "yellow",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "posline"
                    });
                svg.append("svg:path")
                    .attr({
                        d: lineFun(retNeg),
                        "stroke": "black",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "negline"
                    });
                svg.append("svg:path")
                    .attr({
                        d: lineFun(retNeu),
                        "stroke": "red",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass,
                        "id": "neuline"
                    });

                svg.selectAll("dot")
                    .data(retTotal)
                    .enter()
                    .append("circle").attr("r",3)
                    .attr("cx", function(d){
                        return xScale(d.x)+margin.left})
                    .attr("cy",function(d){return yScale(d.y)+margin.top})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                svg.selectAll("dot")
                    .data(retMale)
                    .enter()
                    .append("circle").attr("r",3)
                    .attr("cx", function(d){
                        return xScale(d.x)+margin.left})
                    .attr("cy",function(d){return yScale(d.y)+margin.top})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
                svg.selectAll("dot")
                    .data(retFemale)
                    .enter()
                    .append("circle").attr("r",3)
                    .attr("cx", function(d){
                        return xScale(d.x)+margin.left})
                    .attr("cy",function(d){return yScale(d.y)+margin.top})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
                //console.log("path is", svg.selectAll("dot"));

                svg.selectAll("dot")
                    .data(retPos)
                    .enter()
                    .append("circle").attr("r",3)
                    .attr("cx", function(d){
                        return xScale(d.x)+margin.left})
                    .attr("cy",function(d){return yScale(d.y)+margin.top})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
                svg.selectAll("dot")
                    .data(retNeg)
                    .enter()
                    .append("circle").attr("r",3)
                    .attr("cx", function(d){
                        return xScale(d.x)+margin.left})
                    .attr("cy",function(d){return yScale(d.y)+margin.top})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
                svg.selectAll("dot")
                    .data(retNeu)
                    .enter()
                    .append("circle").attr("r",3)
                    .attr("cx", function(d){
                        return xScale(d.x)+margin.left})
                    .attr("cy",function(d){return yScale(d.y)+margin.top})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
                //console.log("path is", svg.selectAll("dot"))
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
                        d: lineFun(retTotal)
                    });
                svg.selectAll("#maleline")
                    .attr({
                        d: lineFun(retMale)
                    });
                svg.selectAll("#femaleline")
                    .attr({
                        d: lineFun(retFemale)
                    });
            }

            var retTotal = [];
            var retMale = [];
            var retFemale = [];
            var retPos = [];
            var retNeg =[];
            var retNeu = [];
            var line_data = function (data) {

                //console.log("in make data");
                //console.log("data is", data);
                /* Sorting the JSON Data*/

                data.sort(function (a, b) {
                    return a.minutes - b.minutes;
                });
                var total = [];
                var y_val = 0;
                //var gender_male = [];
                //var gender_female = [];
                angular.forEach(data, function (d,i) {
                    //var y_val = d.retweet_count + d.value;
                    y_val = d.value;
                    this.push({"x": d.minutes, "y": y_val, "z": d.gender, "w": d.sentiment});
                    //console.log("gender is", data.gender);
                    //if (data.gender="male"){
                    //    gender_male.push({"x": d.minutes, "y": y_val});
                    //}
                    //else if(data.gender = "female"){
                    //    gender_female.push({"x": d.minutes, "y": y_val});
                    //}
                },total);


                //console.log("values are male , female",gender_male);
                //console.log("female are:",gender_female);
                /* Returning the cumulative sum of y attribute corresponding to same x attribute*/
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
                            retMale.push({"x": tempX, "y": maleY});
                            retFemale.push({"x": tempX, "y": femaleY});
                            retPos.push({"x": tempX, "y": posY});
                            retNeg.push({"x": tempX, "y": negY});
                            retNeu.push({"x": tempX, "y": neuY});
                            totalY = 0;
                            maleY = 0;
                            femaleY = 0;
                            posY = 0;
                            negY = 0;
                            neuY = 0;
                            tempX = d.x;
                        }
                        if(i==(total.length-1)){
                            if (this.length<1){
                                this.push({"x": tempX-2, "y": 0});
                                this.push({"x": tempX-1, "y": 0});
                                this.push({"x": tempX, "y": totalY});
                                this.push({"x": tempX+1, "y": 0});
                                this.push({"x": tempX+2, "y": 0});

                                retMale.push({"x": tempX-2, "y": 0});
                                retMale.push({"x": tempX-1, "y": 0});
                                retMale.push({"x": tempX, "y": maleY});
                                retMale.push({"x": tempX+1, "y": 0});
                                retMale.push({"x": tempX+2, "y": 0});

                                retFemale.push({"x": tempX-2, "y": 0});
                                retFemale.push({"x": tempX-1, "y": 0});
                                retFemale.push({"x": tempX, "y": femaleY});
                                retFemale.push({"x": tempX+1, "y": 0});
                                retFemale.push({"x": tempX+2, "y": 0});

                                retPos.push({"x": tempX-2, "y": 0});
                                retPos.push({"x": tempX-1, "y": 0});
                                retPos.push({"x": tempX, "y": posY});
                                retPos.push({"x": tempX+1, "y": 0});
                                retPos.push({"x": tempX+2, "y": 0});

                                retNeg.push({"x": tempX-2, "y": 0});
                                retNeg.push({"x": tempX-1, "y": 0});
                                retNeg.push({"x": tempX, "y": negY});
                                retNeg.push({"x": tempX+1, "y": 0});
                                retNeg.push({"x": tempX+2, "y": 0});

                                retNeu.push({"x": tempX-2, "y": 0});
                                retNeu.push({"x": tempX-1, "y": 0});
                                retNeu.push({"x": tempX, "y": neuY});
                                retNeu.push({"x": tempX+1, "y": 0});
                                retNeu.push({"x": tempX+2, "y": 0});
                            }
                            else{
                                this.push({"x": tempX, "y": totalY});
                                retMale.push({"x": tempX, "y": maleY});
                                retFemale.push({"x": tempX, "y": femaleY});
                                retPos.push({"x": tempX, "y": posY});
                                retNeg.push({"x": tempX, "y": negY});
                                retNeu.push({"x": tempX, "y": neuY});
                            }
                        }
                    },retTotal)
                }
            };
            line_data(scope.tweets);
            drawLineChart();
        }
    };
}]);