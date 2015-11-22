tweetApp.directive('barChart', function($parse, $window){
    return{
        restrict:'EA',
        template:"<svg></svg>",
        link: function(scope, elem, attrs){
            var margin = {top:10, right: 50, bottom: 35, left: 60};
            width = $("#viz")[0].offsetWidth*0.90,
                height = $("#viz")[0].offsetHeight*0.92;
            //defining bar and axis variables
            var datalen = 2;
            var barClass="bar";
            var xScale, yScale, xAxisGen, yAxisGen;
            //getting d3 window in d3
            var d3 = $window.d3;
            //looking for svg element in html
            var rawSvg=elem.find('svg');
            //setting values for initial dimensions of svg element
            //taking rawSvg in d3 context
            var svg = d3.select(rawSvg[0])
                .attr('width', width)
                .attr('height', height)
                .attr('id', 'bchart');
            var tbarpadding = svg.attr('width')*0.2;
            var barwidth = function (){
                return (($("#bchart").attr("width")-(tbarpadding+margin.left+margin.right))/datalen);
            };
            //fetching data to plot here in chartData, it uses camel case
            // for angularJS so we get plotData in chartData(or chart-data)
            //setting parameters for axises
            var dtp = [];
            var xax = "gender";
            var yax = "tweet_count";
            scope.filterbarchart = function(e, ax){
                dtp = [];
                if(ax=="x"){
                    xax = e;
                }
                else if(ax=="y"){
                    yax = e;
                }
                if(yax=="tweet_count"){
                    dtp= scope.makedata(xax,0);
                }
                else {
                    var temp = [];
                    angular.forEach(scope.tweets, function(d, i){
                        if(yax=="retweet_count" && xax=="gender"){
                            this.push({"x": d.gender, "y": d.retweet_count});
                        }
                        else if(yax=="retweet_count" && xax=="lang"){
                            this.push({"x": d.lang, "y": d.retweet_count});
                        }
                        else if(yax=="retweet_count" && xax=="sentiment"){
                            this.push({"x": d.sentiment, "y": d.retweet_count});
                        }
                        else if(yax=="impact" && xax=="gender"){
                            this.push({"x": d.gender, "y": d.impact});
                        }
                        else if(yax=="impact" && xax=="lang"){
                            this.push({"x": d.lang, "y": d.impact});
                        }
                        else if(yax=="impact" && xax=="sentiment"){
                            this.push({"x": d.sentiment, "y": d.impact});
                        }
                    },temp);
                    temp.sort(function(a,b){
                        return (a.x < b.x)? 1: -1;});
                    if (temp.length != 0){
                        var tempX = temp[0].x;
                        var tempY = 0;
                        angular.forEach(temp, function(d,i){
                            if(i==(temp.length-1)){
                                tempY = tempY + d.y;
                                this.push({"x": tempX, "y": tempY})}
                            else if (tempX == d.x){
                                tempY = tempY + d.y;}
                            else{
                                this.push({"x": tempX, "y":tempY});
                                tempY = d.y;
                                tempX = d.x;}
                        },dtp);
                    }
                    if (xax=="sentiment"){
                        var dtemp =[];
                        angular.forEach(dtp,function(d,i){
                            if (d.x=="1"){
                                this.push({"x": "Positive","y": d.y});
                            }
                            else if (d.x=="2"){
                                this.push({"x": "Negative","y": d.y});
                            }
                            else{
                                this.push({"x": "Neutral","y": d.y});
                            }
                        },dtemp);
                        dtp = dtemp;
                    }
                }
                datalen = dtp.length;
                dataToPlot = dtp;
                $("#bchart").empty();
                drawBarChart();
            };
            //making d3.tip function for d3-tip
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function(d) {
                    return  xax+" : "+d.x+",<br>"+ yax+" : "+d.y;
                });
            //calling tip to append it to svg element
            svg.call(tip);
            //checking for resize on window element if it happens then draw
            // the new graph using same aspect ratio call redrawBarChart()
            angular.element($window).on('resize',function(){
                var the_chart = $("#bchart");
                var container = $("#viz");
                var targetWidth = (container[0].offsetWidth)*0.90;
                console.log("in resize")
                the_chart.attr("width", targetWidth);
                //the_chart.attr("height", Math.round(targetWidth / aspect));
                width = $("#viz")[0].offsetWidth*0.90,
                    height = $("#viz")[0].offsetHeight*0.92;
                var a = angular.copy(dataToPlot);
                ratio = a.sort(function (a, b) {
                    return a.y - b.y;
                });
                ratio = ($("#bchart").attr('height')-margin.bottom)/ratio[ratio.length-1].y;
                redrawBarChart();
            });
            function setChartParameters(){
                //.scale to set scaling for the axis
                // .linear tell the linear behaviour of the axis
                // .domain sets min and max value along the axis
                // .range to set width or height of the axis plotted
                xScale = d3.scale.ordinal()
                    .domain(dataToPlot.map(function(d){ return d.x; }))
                    .rangeRoundBands([0, $("#bchart").attr("width") - margin.right -margin.left],0);
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
            }
            function drawBarChart() {
                //call setChartParameters() function to set variables with values
                setChartParameters();
                //append svg:g i.e. svg graph element to svg
                // next 2 .attr adding x axis to graph followed by calling xAxisGen
                // to created x axis, appended text to axis following are setting
                // parameters to text
                svg.append("svg:g")
                    .attr("class", "x axis")
                    .attr("transform", "translate("+margin.left+","+ parseInt($("#bchart").attr('height')-margin.bottom) +")")
                    .call(xAxisGen)
                    .append("text")
                    .attr("x", ($("#bchart").attr("width")-margin.right-margin.left)/2)
                    .attr("y",margin.bottom*0.8)
                    .style("text-anchor", "middle")
                    .text("-- "+xax+" -->");
                svg.append("svg:g")
                    .attr("class", "y axis")
                    .attr("transform", "translate("+margin.left+","+margin.top+")")
                    .call(yAxisGen)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -(margin.left*0.8))
                    .style("text-anchor", "end")
                    .text("-- "+yax+"-->");
                var a = angular.copy(dataToPlot);
                var ratio = a.sort(function(a, b){return a.y - b.y;});
                ratio = ($("#bchart").attr('height')-margin.bottom)/ratio[ratio.length-1].y;
                svg.selectAll(".bar")
                    .data(dataToPlot)
                    .enter()
                    .append("rect")
                    .attr("class", barClass)
                    .attr("x", function (d, i) {
                        t = (tbarpadding/datalen)/2;
                        return margin.left + t+(((tbarpadding / datalen) + barwidth()) * i);
                    })
                    .attr("width", barwidth())
                    .attr("y", function (d) {
                        return ($("#bchart").attr('height')-margin.bottom) - (d.y*ratio);
                    })
                    .attr("height", function (d) {
                        return d.y*ratio;
                    })
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
                    svg.selectAll(".bar")
                        .data(dataToPlot)
                        .attr("x", function (d, i) {
                            t = (tbarpadding/datalen)/2;
                            return margin.left + t+(((tbarpadding / datalen) + barwidth()) * i);
                        })
                        .attr("width", barwidth())
                        .attr("y", function (d) {
                            return ($("#bchart").attr('height')-margin.bottom) - (d.y*ratio);
                        })
                        .attr("height", function (d) {
                            return d.y*ratio;
                        });
            }
            scope.filterbarchart("gender","x");
            dataToPlot = dtp;
            drawBarChart();
        }
    };
});