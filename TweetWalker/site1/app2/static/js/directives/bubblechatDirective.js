/**
 * Created by ayushgupta on 03/11/15.
 */

tweetApp.directive('bubbleChart', ['$parse', '$window', function($parse, $window) {
    return {
        restrict: 'EA',
        template: "<svg></svg>",
        link: function (scope, elem, attrs) {

            var rawdata = scope.tweets;
            /*var root = {"name": "bubble", "children":
                                            [{"name": "Male",
                                                "size": 0,
                                                "children" :
                                                    [{"name": "Neutral",
                                                        "size": 0},
                                                        {"name": "Positive",
                                                        "size":0},
                                                        {"name": "Negative",
                                                        "size": 0}
                                                        ]},
                                             {"name": "Female",
                                                 "size":0,
                                                 "children":
                                                    [{"name": "Neutral",
                                                        "size": 0},
                                                        {"name": "Positive",
                                                        "size":0},
                                                        {"name": "Negative",
                                                        "size": 0}
                                                        ]
                                             }]
                        };*/
            var root = {"name": "bubble", "children":
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
                // add children sentiment for gender--> lang--> sentiment
                /*for (var key in dict) {
                    root.children[0].children.push({
                        "name": key, "size": dict[key]}
                    );
                    root.children[1].children.push({
                        "name": key, "size": dict[key]});
                }*/
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
       // for gender--> lang--> sentiment
       /* for (i = 0; i < rawdata.length; i++) {
                    obj = rawdata[i];
                    if (obj["gender"] == "male") {
                        root.children[0].size++;
                        for (var j in root.children[0].children){
                            if (root.children[0].children[j].name == obj["lang"]){
                                root.children[0].children[j].size++;
                                if (obj["sentiment"] == 0) {
                                    root.children[0].children[j].children[0].size++;
                                }
                                else if (obj["sentiment"] == 1) {
                                    root.children[0].children[j].children[0].size++;
                                }
                                else if (obj["sentiment"] == 2) {
                                    root.children[0].children[j].children[0].size++;
                                }
                                break;
                            }
                        }
                    }
                    else if (obj["gender"] == "female") {
                        root.children[1].size++;
                        for (j in root.children[1].children){
                            if (root.children[0].children[j].name == obj["lang"]){
                                root.children[0].children[j].size++;
                                if (obj["sentiment"] == 0) {
                                    root.children[0].children[j].children[0].size++;
                                }
                                else if (obj["sentiment"] == 1) {
                                    root.children[0].children[j].children[1].size++;
                                }
                                else if (obj["sentiment"] == 2) {
                                    root.children[0].children[j].children[2].size++;
                                }
                            }
                            break;
                        }
                    }
                }*/

    console.log(root);

    var margin = 20,
    diameter = Math.min($("#viz")[0].offsetWidth, $("#viz")[0].offsetHeight);

/*
var color = d3.scale.linear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);
*/
    var color = d3.scale.category10();
    var pack = d3.layout.pack()
                        .padding(2)
                        .size([diameter - margin, diameter - margin])
                        .value(function(d) { return d.size; });
    var rawsvg = elem.find("svg");
    var svg = d3.select(rawsvg[0])
                .attr("width", diameter)
                .attr("height", diameter)
                .append("g")
                .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

      var focus = root,
          nodes = pack.nodes(root),
          view;

      var circle = svg.selectAll("circle")
                        .data(nodes)
                        .enter().append("circle")
                            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                            .style("fill", function(d) { return d.children ? color(d.depth) : color(d.depth); })
                            .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
      var text = svg.selectAll("text")
                    .data(nodes)
                    .enter().append("text")
                        .attr("class", "label")
                        .attr("text-anchor", "middle")
                        .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
                        .style("display", function(d) { return d.parent === root ? null : "none"; })
                        .text(function(d) { return d.name.substring(0, d.r / 3); });

      var node = svg.selectAll("circle, text");
      /*d3.select("#bubble")
          .style("background", color(-1))
          .on("click", function() { zoom(root); });
    */
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
                //.filter(function(d) {  return d.parent === focus || this.style.display === "inline"; })
                .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }

      function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        circle.attr("r", function(d) { return d.r * k; });
      }

            /*var width = $("#viz")[0].offsetWidth;
            var w = $("#viz")[0].offsetWidth*0.68*0.95;
            var h = Math.ceil(w*0.7);
            var oR = 0;
            var nTop = 0;
            
            var svgContainer = d3.select("#mainBubble")
              .style("height", h+"px");
           
            var rawSvg=elem.find('svg');

            var svg = d3.select(rawSvg[0])
                .attr("class", "mainBubbleSVG")
                .attr("width", width)
                .attr("height",h)
                .on("mouseleave", function() {return resetBubbles();});
            console.log(dict);
           
            var bubbleObj = svg.selectAll(".topBubble")
                        .data(dict.children)
                        .enter().append("g")
                            .attr("id", function(d,i) {return "topBubbleAndText_" + i});
                //console.log(root); 
          
            nTop = dict.children.length;
            oR = w/(1+3*nTop); 
            h = Math.ceil(w/nTop*2);
            svgContainer.style("height",h+"px");
                 
            var colVals = d3.scale.category10();
                 
            bubbleObj.append("circle")
                    .attr("class", "topBubble")
                    .attr("id", function(d,i) {return "topBubble" + i;})
                    .attr("r", function(d) { return oR*Math.sqrt(d.Count/totalcount); })
                    .attr("cx", function(d, i) {return oR*(3*(1+i)-1);})
                    .attr("cy", (h+oR)/3)
                    .style("fill", function(d,i) { return colVals(i); }) // #1f77b4
                    .style("opacity",0.3)
                    .on("mouseover", function(d,i) {return activateBubble(d,i);});
                 
            bubbleObj.append("text")
                    .attr("class", "topBubbleText")
                    .attr("x", function(d, i) {return oR*(3*(1+i)-1);})
                    .attr("y", (h+oR)/3)
                    .style("fill", function(d,i) { return colVals(i); }) // #1f77b4
                    .attr("font-size", 30)
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .attr("alignment-baseline", "middle")
                    .text(function(d) {return d.gender})     
                    .on("mouseover", function(d,i) {return activateBubble(d,i);});
                 
                 
            for(var iB = 0; iB < nTop; iB++)
            {
                var childBubbles = svg.selectAll(".childBubble" + iB)
                    .data(dict.children[iB].children)
                    .enter().append("g");
                 
                childBubbles.append("circle")
                    .attr("class", "childBubble" + iB)
                    .attr("id", function(d,i) {return "childBubble_" + iB + "sub_" + i;})
                    .attr("r",  function(d, i) {return oR/3.0* Math.sqrt(d.Count/dict.children[iB].Count);})
                    .attr("cx", function(d,i) {return (oR*(3*(iB+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
                    .attr("cy", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926));})
                    .attr("cursor","pointer")
                    .style("opacity",0.5)
                    .style("fill", "#eee")
                    .on("click", function(d,i) {
                        window.open(d.address);                
                    })
                    .on("mouseover", function(d,i) {
                        //window.alert("say something");
                    })
                    .append("svg:title")
                    .text(function(d) { return d.address; });  
     
                childBubbles.append("text")
                    .attr("class", "childBubbleText" + iB)
                    .attr("x", function(d,i) {return (oR*(3*(iB+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
                    .attr("y", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926));})
                    .style("opacity",0.5)
                    .attr("text-anchor", "middle")
                    .style("fill", function(d,i) { return colVals(iB); }) // #1f77b4
                    .attr("font-size", 6)
                    .attr("cursor","pointer")
                    .attr("dominant-baseline", "middle")
                    .attr("alignment-baseline", "middle")
                    .text(function(d) {return d.Sentiment})     
                    .on("click", function(d,i) {
                    window.open(d.address);
                    });
                }

            resetBubbles = function () {
          
            width = $("#viz")[0].offsetWidth;
            w = $("#viz")[0].offsetWidth*0.68*0.95;
            oR = w/(1+3*nTop);
           
            h = Math.ceil(w/nTop*2);
            svgContainer.style("height",h+"px");
     
            console.log("in reset");
            svg.attr("width", width);
            svg.attr("height",h);      
           
            var t = svg.transition()
                       .duration(650);
             
            t.selectAll(".topBubble")
                .attr("r", function(d) { return oR*Math.sqrt(d.Count/totalcount); })
                .attr("cx", function(d, i) {return oR*(3*(1+i)-1);})
                .attr("cy", (h+oR)/3);
     
            t.selectAll(".topBubbleText")
                .attr("font-size", 30)
                .attr("x", function(d, i) {return oR*(3*(1+i)-1);})
                .attr("y", (h+oR)/3);
         
            for(var k = 0; k < nTop; k++)
            {
                t.selectAll(".childBubbleText" + k)
                    .attr("x", function(d,i) {return (oR*(3*(k+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
                    .attr("y", function(d,i) {return ((h+oR)/3 + oR*1.5*Math.sin((i-1)*45/180*3.1415926));})
                    .attr("font-size", 6)
                    .style("opacity",0.5);
     
                t.selectAll(".childBubble" + k)
                    .attr("r",  function(d) {return oR/3.0*Math.sqrt(d.Count/dict.children[k].Count);})
                    .style("opacity",0.5)
                    .attr("cx", function(d,i) {return (oR*(3*(k+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926));})
                    .attr("cy", function(d,i) {return ((h+oR)/3 + oR*1.5*Math.sin((i-1)*45/180*3.1415926));});
                         
            }  
        };
                 
        function activateBubble(d,i) {
            // increase this bubble and decrease others
            var t = svg.transition()
                        .duration(d3.event.altKey ? 7500 : 350);
         
            t.selectAll(".topBubble")
                .attr("cx", function(d,ii){
                    if(i == ii) {
                        // Nothing to change
                        return oR*(3*(1+ii)-1) - 0.6*oR*(ii-1);
                        } else {
                            // Push away a little bit
                            if(ii < i){
                                // left side
                                return oR*0.6*(3*(1+ii)-1);
                            } else {
                                // right side
                                return oR*(nTop*3+1) - oR*0.6*(3*(nTop-ii)-1);
                            }
                        }              
                    })
                .attr("r", function(d, ii) {
                    if(i == ii)
                        return oR*1.8* Math.sqrt(d.Count/totalcount);
                    else
                        return oR*0.8* Math.sqrt(d.Count/totalcount);
                });
                         
            t.selectAll(".topBubbleText")
                .attr("x", function(d,ii){
                    if(i == ii) {
                        // Nothing to change
                        return oR*(3*(1+ii)-1) - 0.6*oR*(ii-1);
                        } else {
                            // Push away a little bit
                            if(ii < i){
                                // left side
                                return oR*0.6*(3*(1+ii)-1);
                            } else {
                                // right side
                                return oR*(nTop*3+1) - oR*0.6*(3*(nTop-ii)-1);
                            }
                        }              
                    })         
                .attr("font-size", function(d,ii){
                    if(i == ii)
                        return 30*1.5;
                    else
                        return 30*0.6;             
                    });
         
            var signSide = -1;
            for(var k = 0; k < nTop; k++)
            {
                signSide = 1;
                if(k < nTop/2) signSide = 1;
                t.selectAll(".childBubbleText" + k)
                    .attr("x", function(d,i) {return (oR*(3*(k+1)-1) - 0.6*oR*(k-1) + signSide*oR*2.5*Math.cos((i-1)*45/180*3.1415926));})
                    .attr("y", function(d,i) {return ((h+oR)/3 + signSide*oR*2.5*Math.sin((i-1)*45/180*3.1415926));})
                    .attr("font-size", function(){
                            return (k==i)?12:6;
                            })
                    .style("opacity",function(){
                            return (k==i)?1:0;
                            });
                         
                t.selectAll(".childBubble" + k)
                    .attr("cx", function(d,i) {return (oR*(3*(k+1)-1) - 0.6*oR*(k-1) + signSide*oR*2.5*Math.cos((i-1)*45/180*3.1415926));})
                    .attr("cy", function(d,i) {return ((h+oR)/3 + signSide*oR*2.5*Math.sin((i-1)*45/180*3.1415926));})
                    .attr("r", function(d){
                            return (k==i)?(oR*0.55* Math.sqrt(d.Count/dict.children[k].Count)):(oR/3.0* Math.sqrt(d.Count/dict.children[k].Count));              
                        })
                    .style("opacity", function(){
                            return (k==i)?1:0;                 
                    });
                }                  
                }
         
        window.onresize = resetBubbles;
*/

        }
    }
}]);