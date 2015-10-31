
/**
 * Created by Abir on 10/15/15.
 */
tweetApp.directive('pieChart',['$parse', '$window', function($parse, $window){

    return {
        restrict: 'EA',
        template: "<svg></svg>",
        link: function (scope, elem, attrs) {
            var rawdata = scope.tweets;
            var dict = {};
            // we need to get full name of language
            // we can use lang.js but there are languages that it doesn't support
            for(var i=0;i<rawdata.length;i++){
                var obj = rawdata[i];
                if (obj["lang"] in dict){
                    dict[obj["lang"]]++;
                }
                else{
                    dict[obj["lang"]] = 1;
                }
             }
            for (var key in dict) {
                if (dict.hasOwnProperty(key)) {
                    if (dict[key] < 10) {
                        if ("Other" in dict) {
                            dict["Other"] += dict[key];
                        }
                        else {
                            dict["Other"] = dict[key];
                        }
                        delete dict[key];
                    }
                    else if (key == "und"){
                        dict["undetermined"] = dict[key]
                        delete dict[key];
                    }
                }
            }

            var data = [];
            var totalcount = 0;
                for (key in dict){
                    if (dict.hasOwnProperty(key)) {
                        totalcount += dict[key];
                        data.push({"x": key, "y": dict[key]})
                    }
                }

            console.log("in directive");
            var margin = {top:10, right: 50, bottom: 25, left: 60};
            var padding = 0;
            var width = $("#viz")[0].offsetWidth,
                height = $("#viz")[0].offsetHeight,
                radius = Math.min(width, height) / 2;
            var rawsvg = elem.find("svg");
            var color = d3.scale.category20();
            var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .html(function(d) {
                        var percentage = (d.data.y/totalcount)*100;
                        var txt = "<p>Language: " + getLanguageName(d.data.x) + "<br>" +
                                "Native Language: " + getLanguageNativeName(d.data.x) + "<br>" +
                                "Count: " + d.data.y + "<br>" +
                                "Percentage: " + percentage.toPrecision(3) + "%<p>";
                        return txt;
                });
            var arc = d3.svg.arc()
                        .outerRadius(radius - 10)
                        .innerRadius(3 * radius/5);
            var pie = d3.layout.pie()
                        .sort(null)
                        .value(function(d) { return d.y; });
            var svg = d3.select(rawsvg[0])
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                            .attr("transform", "translate(" + width / (width/height) + "," + height / 2 + ")");
            var g = svg.selectAll(".arc")
                        .data(pie(data))
                        .enter().append("g")
                            .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .style("fill", function(d) { return color(d.data.x); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            g.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .text(function(d) { return d.data.x; })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
            svg.call(tip)

        }

    }
}]);