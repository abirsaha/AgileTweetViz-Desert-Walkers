/**
 * Created by Abir on 11/6/15.
 */
tweetApp.directive('treeMap', function ($compile) {
    return {
        restrict:'EA',
        template:"<div id='treeNode'></div>",
        scope: {
            data: '='
        },
        link: function(scope, elem, attrs){
            console.log("asasa",scope.data);
            var tree = {
                name: "tree",
                children: [
                    { name: "Word-wrapping comes for free in HTML", size: 16 },
                    { name: "animate makes things fun", size: 80 },
                    { name: "data data everywhere...", size: 52 },
                    { name: "display something beautiful", size: 36 },
                    { name: "flex your muscles", size: 98 },
                    { name: "physics is religion", size: 64 },
                    { name: "query and you get the answer", size: 21 },
                ]
            };

            var width = 370,
                height = 420,
                color = d3.scale.category20c(),
                div = d3.select("#treeNode").append("div")
                    .style("position", "relative");

            var treemap = d3.layout.treemap()
                .size([width, height])
                .sticky(true)
                .value(function(d) { return d.population; });

            var node = div.datum(scope.data).selectAll(".node")
                .data(treemap.nodes)
                .enter().append("div")
                .attr("class", "node")
                .attr("id",function(d){
                    return d.screenname;
                })
                .call(position)
                .style("background", function(d) {
                    return d.label == 'tree' ? '#fff' : color(d.label);

                })
                .append('div')
                .style("font-size", function(d) {
                    // compute font size based on sqrt(area)
                    return Math.max(20, 0.18*Math.sqrt(d.area))+'px'; })
                // .text(function(d) { return d.children ? null : d.label; })
                .append('img')
                .attr('src',function(d){

                    return d.url;
                    // return "https://pbs.twimg.com/profile_images/482405543554711554/cgyPrsSN_normal.jpeg"
                });
            //.style("height", function(d) {
            //    // compute font size based on sqrt(area)
            //    return Math.max(60, 0.18*Math.sqrt(d.area))+'px'; })
            //.style("align", 'center'
            //   );

            function position() {
                this.style("left", function(d) { return d.x + "px"; })
                    .style("top", function(d) { return d.y + "px"; })
                    .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
                    .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
            }


        }

    }});