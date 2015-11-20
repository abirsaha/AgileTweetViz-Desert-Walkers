tweetApp.directive('treeMap', function ($compile, $window) {
    return {
        restrict: 'EA',
        template: "<div id='treeNode'></div>",
        scope: {
            data: '='
        },
        link: function (scope, elem, attrs) {

            function onLoad() {
                var width = parseInt(angular.element('#treeMap').css("width")),
                    height = parseInt(angular.element('#treeMap').css("height")),
                    color = d3.scale.category20c(),
                    div = d3.select("#treeNode").append("div")
                        .style("position", "relative");
                var treemap = d3.layout.treemap()
                    .size([width, height])
                    .sticky(true)
                    .value(function (d) {
                        return d.population;
                    });

                var mousemove = function(e,id,url,tweet) {


                    var xPosition = e.pageX + 5;
                    var yPosition = e.pageY + 5;


                    d3.select("#tooltip")
                        .style("left", xPosition + "px")
                        .style("top", yPosition + "px");
                    d3.select("#tooltip #heading")
                        .text(id);

                    d3.select("#tooltip #percentage")
                        .text(tweet);
                    
                    d3.select("#tooltip").classed("hidden", false);
                };

                var mouseout = function(e) {

                    d3.select("#tooltip").classed("hidden", true);

                };


                var node = div.datum(scope.data).selectAll(".node")
                    .data(treemap.nodes)
                    .enter().append("div")
                    .attr("class", "node")
                    .attr("id", function (d) {
                        return d.screenname;
                    })
                    .attr("url", function (d) {
                        return d.url;
                    })
                    .attr("tweet", function (d) {
                        return d.tweet;
                    })
                    .call(position)
                    .style("background", function (d) {
                        return d.label == 'tree' ? '#fff' : color(d.label);

                    })
                    .append('div')
                    .style("font-size", function (d) {
                        // compute font size based on sqrt(area)
                        return Math.max(20, 0.18 * Math.sqrt(d.area)) + 'px';
                    })
                    .append('img')
                    .attr('src', function (d) {

                        return d.url;
                        // return "https://pbs.twimg.com/profile_images/482405543554711554/cgyPrsSN_normal.jpeg"
                    })

                    .style("width", function (d, i) {
                        //    // compute font size based on sqrt(area)
                        var id = d.screenname;
                        var width = angular.element(this).parent().parent().css("width");
                        return width
                    })
                    .style("height", function (d, i) {
                        //    // compute font size based on sqrt(area)
                        var id = d.screenname;
                        var height = angular.element(this).parent().parent().css("height");
                        return height;
                    })
                    $('.node').on("mousemove", function(e){
                        mousemove(e,this.id,$(this).attr("url"),$(this).attr("tweet"))
                    })
                    .on("mouseout", function(e){
                            mouseout(e)
                        });

                function position() {
                    this.style("left", function (d) {
                        return d.x + "px";
                    })
                        .style("top", function (d) {
                            return d.y + "px";
                        })
                        .style("width", function (d) {
                            return Math.max(0, d.dx - 1) + "px";
                        })
                        .style("height", function (d) {
                            return Math.max(0, d.dy - 1) + "px";
                        });
                };


            }

            function clear() {
                d3.select("#treeNode").selectAll(".node").remove();

            };
            onLoad();

            angular.element($window).on('resize', function () {
                clear();


                onLoad();
            });
        }


    }
});