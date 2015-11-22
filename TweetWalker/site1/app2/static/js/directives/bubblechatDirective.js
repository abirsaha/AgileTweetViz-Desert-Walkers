/**
 * Created by ayushgupta on 03/11/15.
 */

tweetApp.directive('bubbleChart', ['$parse', '$window', function($parse, $window) {
    return {
        restrict: 'EA',
        template: "<svg></svg>",
        link: function (scope, elem, attrs) {

            var rawdata = scope.tweets;
            var root = {"name": "bubble", size: 0, "children":
                                            [{"name": "Male",
                                                "size": 0,
                                                "children" :
                                                    []},
                                             {"name": "Female",
                                                 "size":0,
                                                 "children":
                                                    []
                                             }]
                        };
            if (attrs.type == "lang") {
                var dict = {};
                // we need to get full name of language
                // we can use lang.js but there are languages that it doesn't support
                var j = 0;
                for (var i = 0; i < rawdata.length; i++) {
                    var obj = rawdata[i];
                    root.size++;
                    if (!(obj["lang"] in dict)) {

                        dict[obj["lang"]] = j;
                        j++;
                        if (obj["gender"] == "male") {
                            root.children[0].children.push({
                                    "name": obj["lang"], "size": 1
                                });
                            root.children[1].children.push({
                                    "name": obj["lang"], "size": 0
                                });
                        }

                        else if (obj["gender"] == "female"){
                            root.children[0].children.push({
                                    "name": obj["lang"], "size": 0
                                });
                            root.children[1].children.push({
                                    "name": obj["lang"], "size": 1
                                });
                        }
                    }
                    else {
                        if (obj["gender"] == "male") {
                            root.children[0].size++;
                            root.children[0].children[dict[obj["lang"]]].size++;
                        }
                        else if (obj["gender"] == "female"){
                            root.children[1].size++;
                            root.children[1].children[dict[obj["lang"]]].size++;
                        }

                    }
                }
            }

            if (attrs.type == "sentiment") {
                root.children[0].children.push({"name": "Neutral",
                                                        "size": 0},
                                                        {"name": "Positive",
                                                        "size":0},
                                                        {"name": "Negative",
                                                        "size": 0},
                                                        {"name": "Other",
                                                        "size": 0}
                    );
                    root.children[1].children.push({"name": "Neutral",
                                                        "size": 0},
                                                        {"name": "Positive",
                                                        "size":0},
                                                        {"name": "Negative",
                                                        "size": 0},
                                                        {"name": "Other",
                                                        "size": 0}    );

                for (var i = 0; i < rawdata.length; i++) {
                    var obj = rawdata[i];
                    root.size++;
                    if (obj["gender"] == "male") {
                        root.children[0].size++;
                        if (obj["sentiment"] == 0) {
                            root.children[0].children[0].size++;
                        }
                        else if (obj["sentiment"] == 1) {
                            root.children[0].children[1].size++;
                        }
                        else if (obj["sentiment"] == 2) {
                            root.children[0].children[2].size++;
                        }
                        else if (obj["sentiment"] == -1) {
                            root.children[0].children[3].size++;
                        }
                    }
                    else if (obj["gender"] == "female") {
                        root.children[1].size++;
                        if (obj["sentiment"] == 0) {
                            root.children[1].children[0].size++;
                        }
                        else if (obj["sentiment"] == 1) {
                            root.children[1].children[1].size++;
                        }
                        else if (obj["sentiment"] == 2) {
                            root.children[1].children[2].size++;
                        }
                        else if (obj["sentiment"] == -1) {
                            root.children[0].children[3].size++;
                        }
                    }
                }
            }

    var margin = 50,
    diameter = Math.min($("#viz")[0].offsetWidth, $("#viz")[0].offsetHeight);
    var color = d3.scale.category10();
    var pack = d3.layout.pack()
                        .padding(5)
                        .size([diameter - margin, diameter - margin])
                        .value(function(d) { return d.size; });
    var rawsvg = elem.find("svg");
    var svg = d3.select(rawsvg[0])
                .attr("width", $("#viz")[0].offsetWidth)
                .attr("height", $("#viz")[0].offsetHeight)
                .append("g")
                .attr("transform", "translate(" + $("#viz")[0].offsetWidth / 2 + "," + $("#viz")[0].offsetHeight / 2 + ")");

      var focus = root,
          nodes = pack.nodes(root),
          view;

        var tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function (d) {
                    if (d.parent == undefined){
                        var txt = "<p>" + d["name"] + ": " + d["size"] + "</p>";

                    }
                    else {
                        var totalcount = 0;
                        for (var i = 0; i < d.parent.children.length; i++) {
                            totalcount += d.parent.children[i]["size"];
                        }
                        var name;
                        if ((d.parent.name == "Male" || d.parent.name == "Female") && (attrs.type == "lang"))
                        {
                            if (d["name"] == "und")
                                name = "Undetermined";
                            else if (getLanguageName(d["name"]) == "undefined"){
                                console.log(d["name"]);
                                name = d["name"];}
                            else
                                name = getLanguageName(d["name"]);
                        }
                        else
                            name = d["name"];
                        var percentage = (d["size"] / totalcount) * 100;
                        var txt = "<p>" + name + ": " + d["size"] + "<br>" +
                            "Percentage: " + percentage.toPrecision(3) + "</p>";
                    }
                    return txt;

                });
        svg.call(tip);

      var circle = svg.selectAll("circle")
                        .data(nodes)
                        .enter().append("circle")
                            .attr("class", function(d) { return d.parent ? d.children ? "root" : "root node--leaf" : "root node--root"; })
                            .style("fill", function(d) { return d.children ? color(d.depth) : color(d.depth); })
                            .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); })
                            .on('mouseover', tip.show)
                            .on('mouseout', tip.hide);
      var text = svg.selectAll("text")
                    .data(nodes)
                    .enter().append("text")
                        .attr("class", "label")
                        .attr("text-anchor", "middle")
                        .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
                        .style("display", function(d) { return d.parent === root ? null : "none"; })
                        .text(function(d) { return d.name.substring(0, d.r / 3); });

      var node = svg.selectAll("circle, text");

      zoomTo([root.x, root.y, root.r * 2 + margin]);

      function zoom(d) {
            var focus0 = focus; focus = d;
            var transition = svg.transition()
                                .duration(d3.event.altKey ? 7500 : 750)
                                .tween("zoom", function(d) {
                                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                                    return function(t) { zoomTo(i(t)); };
                                });
            transition.selectAll("text")
                .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }

      function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        circle.attr("r", function(d) { return d.r * k; });
      }


        }
    }
}]);