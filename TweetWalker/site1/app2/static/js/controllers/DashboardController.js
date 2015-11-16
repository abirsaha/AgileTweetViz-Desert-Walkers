/**
 * Created by Abir on 10/15/15.
 */

tweetApp.controller('DashboardCtrl',['$scope','$interval','$window',function ($scope,$interval,$window) {

    $scope.tweets = JSON.parse($window.data);
    $scope.hashtagdb;

    $scope.disabled = true;

    $scope.$watch('hashtagdb',function(newVal){
        if(newVal != "" && newVal != undefined){
            $scope.disabled = false;

        }
        else{
            $scope.disabled = true;
        }
    });

    //console.log("in dashboard",$scope.tweets);
	
	// Getting count of the attributes inside each tweet
	// Object.keys($scope.tweets[0]).length

    $scope.line_met = [
        "total",
        "gender",
        "sentiment"
    ];

    $scope.x_line_tweets = [
        "time",
        "sentiment"
    ];
    $scope.y_line_tweets = [
        "tweet count",
        "retweet count",
        "impact"
    ];
    $scope.bar_x_met = [
        "gender",
        "lang",
        "sentiment"
    ];
    $scope.bar_y_met = [
        "tweet_count",
        "retweet_count",
        "impact"
    ];
    $scope.pie_met = [
        "gender",
        "lang",
        "sentiment"
    ];

    /* Converting chart Data in to 2D data */

    var make_2d_Data = function (data, xCol, yCol) {
        //console.log("in make data");
        //console.log("data is", data);

        var temp = [];

        angular.forEach(data, function (d,i) {
            if (xCol == "minutes" && yCol == "retweet_count")
                this.push({"x": d.minutes, "y": d.retweet_count});
            if (xCol == "time" && yCol == "tweet_count")
                this.push({"x": d.time, "y": d.tweet_count});
            else if (xCol == "time" && yCol == "retweet_count")
                this.push({"x": d.time, "y": d.retweet_count});
            else if (xCol == "time" && yCol == "impact")
                this.push({"x": d.time, "y": d.impact});
            else if (xCol == "gender" && yCol == "tweet_count")
                this.push({"x": d.gender, "y": d.tweet_count});
            else if (xCol == "gender" && yCol == "retweet_count")
                this.push({"x": d.gender, "y": d.retweet_count});
            else if (xCol == "gender" && yCol == "impact")
                this.push({"x": d.gender, "y": d.impact});
            else if (xCol == "lang" && yCol == "tweet_count")
                this.push({"x": d.lang, "y": d.tweet_count});
            else if (xCol == "lang" && yCol == "retweet_count")
                this.push({"x": d.lang, "y": d.retweet_count});
            else if (xCol == "lang" && yCol == "impact")
                this.push({"x": d.lang, "y": d.impact});
            else if (xCol == "sentiment" && yCol == "tweet_count")
                this.push({"x": d.sentiment, "y": d.tweet_count});
            else if (xCol == "sentiment" && yCol == "retweet_count")
                this.push({"x": d.sentiment, "y": d.retweet_count});
            else if (xCol == "sentiment" && yCol == "impact")
                this.push({"x": d.sentiment, "y": d.impact});
            else this.push({"x": d.time, "y": d.tweet_count});
        },temp);

        /* Sorting the 2D JSON Data*/
        temp.sort(function (a, b) {
            return a.x - b.x;
        });

        /* Returning the cumulative sum of y attribute corresponding to same x attribute*/
        var retValue = [];
        if (temp.length != 0) {
            var tempX = temp[0].x;
            var tempY = 0;
            angular.forEach(temp, function (d,i) {
                if (tempX == d.x) {
                    tempY = tempY + d.y;
                }
                else {
                    this.push({"x": tempX, "y": tempY});
                    tempY = 0;
                    tempX = d.x;
                }
                if(i==(temp.length-1)){
                    if (this.length<1){
                        this.push({"x": tempX-2, "y": 0});
                        this.push({"x": tempX-1, "y": 0});
                        this.push({"x": tempX, "y": tempY});
                        this.push({"x": tempX+1, "y": 0});
                        this.push({"x": tempX+2, "y": 0});
                    }
                    else{
                        this.push({"x": tempX, "y": tempY})
                    }
                }
            },retValue)
        }
        return retValue;
    };

    /*variables that will determine the x-axis and y-axis of the visualization*/
    var x_checked_element = "sentiment";
    var y_checked_element = "impact";

    /*Putting chart data to scope*/
    $scope.plotData  = make_2d_Data($scope.tweets, x_checked_element, y_checked_element);

    /*OnClick event of the radio buttons in x-axis of line chart*/
    //$scope.xLineKey=0;
    //var x_line_clicked_element = [];
    $scope.totalbool = true;
    $scope.genderbool = false;
    $scope.sentibool = false;

    window.check_x_line = function(e){
        var margin = {top:10, right: 50, bottom: 25, left: 20};
        var xScale = d3.scale.linear()
            .domain([$scope.retTotal[0].x, $scope.retTotal[$scope.retTotal.length-1].x])
            .range([0, $("#viz")[0].offsetWidth - margin.right -margin.left]);

        var yScale = d3.scale.linear()
            .domain([0, d3.max($scope.retTotal, function (d) {
               return d.y;
            })])
            .range([$("#lchart").attr("height")-margin.bottom-margin.top, 0]);

       //getting d3 window in d3
       //var d3 = window.d3;

       //making d3.tip function for d3-tip
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) {
                //console.log("in tip",d);
                return  "Minutes: "+d.x+",<br>"+" Tweet Count: "+ d.y;
            });

        //calling tip to append it to svg element
        d3.select("#lchart")
            .call(tip);

       //d3.select("#lchart").selectAll("circle").remove();
       //    .style({
       //    opacity: 0
       //});
       //console.log(d3.select("#lchart").selectAll("dot"));
       //x_line_clicked_element = [];
       //x_line_clicked_element.push(e);
       //e = d3.select("path#totalline");
       //f = d3.select("path#maleline");
       //g = d3.select("path#femaleline");
       //console.log("in on click",x_line_clicked_element);
        if (e == "total"){
            $scope.totalbool = true;
            $scope.genderbool = false;
            $scope.sentibool = false;
            d3.select("#lchart")
                .selectAll("circle")
                .remove();
            d3.select("path#maleline")
                .style({
                    opacity:0
                });
            d3.select("path#femaleline")
                .style({
                    opacity:0
                });
            d3.select("path#posline")
                .style({
                    opacity:0
                });
            d3.select("path#negline")
                .style({
                    opacity:0
                });
            d3.select("path#neuline")
                .style({
                    opacity:0
                });
            d3.select("path#totalline")
                .style({
                    opacity:1
                });
            d3.select("#lchart")
                .selectAll("dot")
                .data($scope.retTotal)
                .enter()
                .append("circle")
                .attr("r",3)
                .attr("cx", function(d){
                    return xScale(d.x)+margin.left
                })
                .attr("cy",function(d){
                    return yScale(d.y)+margin.top
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
        }
       else if (e == "gender"){
           $scope.totalbool = false;
           $scope.genderbool = true;
           $scope.sentibool = false;
           d3.select("#lchart")
               .selectAll("circle")
               .remove();
           //console.log("in gender if");
           d3.select("path#maleline")
               .style({
                   opacity:1
               });
           d3.select("path#femaleline")
               .style({
                   opacity:1
               });
           d3.select("path#posline")
               .style({
                   opacity:0
               });
           d3.select("path#negline")
               .style({
                   opacity:0
               });
           d3.select("path#neuline")
               .style({
                   opacity:0
               });
           d3.select("path#totalline")
               .style({
                   opacity:0
               });
           d3.select("#lchart")
               .selectAll("dot")
               .data($scope.retMale)
               .enter()
               .append("circle")
               .attr("r",3)
               .attr("cx", function(d){
                   return xScale(d.x)+margin.left
               })
               .attr("cy",function(d){
                   return yScale(d.y)+margin.top
               })
               .on('mouseover', tip.show)
               .on('mouseout', tip.hide);
           d3.select("#lchart")
               .selectAll("dot")
               .data($scope.retFemale)
               .enter()
               .append("circle")
               .attr("r",3)
               .attr("cx", function(d){
                   return xScale(d.x)+margin.left
               })
               .attr("cy",function(d){
                   return yScale(d.y)+margin.top
               })
               .on('mouseover', tip.show)
               .on('mouseout', tip.hide);
       }
       else if (e == "sentiment"){
           $scope.totalbool = false;
           $scope.genderbool = false;
           $scope.sentibool = true;
           d3.select("#lchart")
               .selectAll("circle")
               .remove();
           d3.select("path#maleline")
               .style({
                   opacity:0
               });
           d3.select("path#femaleline")
               .style({
                   opacity:0
               });
           d3.select("path#posline")
               .style({
                   opacity:1
               });
           d3.select("path#negline")
               .style({
                   opacity:1
               });
           d3.select("path#neuline")
               .style({
                   opacity:1
               });
           d3.select("path#totalline")
               .style({
                   opacity:0
               });
           d3.select("#lchart")
               .selectAll("dot")
               .data($scope.retPos)
               .enter()
               .append("circle")
               .attr("r",3)
               .attr("cx", function(d){
                   return xScale(d.x)+margin.left
               })
               .attr("cy",function(d){
                   return yScale(d.y)+margin.top
               })
               .on('mouseover', tip.show)
               .on('mouseout', tip.hide);
           d3.select("#lchart")
               .selectAll("dot")
               .data($scope.retNeg)
               .enter()
               .append("circle")
               .attr("r",3)
               .attr("cx", function(d){
                   return xScale(d.x)+margin.left
               })
               .attr("cy",function(d){
                   return yScale(d.y)+margin.top
               })
               .on('mouseover', tip.show)
               .on('mouseout', tip.hide);
           d3.select("#lchart")
               .selectAll("dot")
               .data($scope.retNeu)
               .enter()
               .append("circle")
               .attr("r",3)
               .attr("cx", function(d){
                   return xScale(d.x)+margin.left
               })
               .attr("cy",function(d){
                   return yScale(d.y)+margin.top
               })
               .on('mouseover', tip.show)
               .on('mouseout', tip.hide);
       }
        //console.log("in check_x_line",element,x_line_clicked_element,e,f,g);
    };

    /*OnClick event of the radio buttons in y-axis of line chart*/
    var y_line_clicked_element = [];
    $scope.check_y_line = function(element){
        y_line_clicked_element = [];
        y_line_clicked_element.push(element);
        // console.log("in check_y_line",element,y_line_clicked_element);
    };

    /*OnClick event of the radio buttons in x-axis of bar chart*/
    var x_bar_clicked_element = [];
    window.check_x_bar = function(element){
        x_bar_clicked_element = [];
        x_bar_clicked_element.push(element);
        regenerateBarViz();
        // console.log("in check_x_line",element,x_bar_clicked_element);
    };

    /*OnClick event of the radio buttons in y-axis of bar chart*/
    var y_bar_clicked_element = [];
    window.check_y_bar = function(element){
        y_bar_clicked_element = [];
        y_bar_clicked_element.push(element);
        regenerateBarViz();
        // console.log("in check_y_line",element,y_line_clicked_element);
    };

    $scope.tab_change = function(element) {
        if(element == "1D") {
            document.getElementById(element).style.display = '';
            document.getElementById("1M").style.display = '';

            document.getElementById("2D").style.display = 'none';
            document.getElementById("3D").style.display = 'none';
        }
        else if(element == "2D") {
            document.getElementById(element).style.display = '';

            document.getElementById("3D").style.display = 'none';
            document.getElementById("1D").style.display = 'none';
            document.getElementById("1M").style.display = 'none';
        }
        else if(element == "3D") {
            document.getElementById(element).style.display = '';

            document.getElementById("2D").style.display = 'none';
            document.getElementById("1D").style.display = 'none';
            document.getElementById("1M").style.display = 'none';
        }
        else {
            document.getElementById("3D").style.display = 'none';
            document.getElementById("2D").style.display = 'none';
            document.getElementById("1D").style.display = 'none';
            document.getElementById("1M").style.display = 'none';
        }
    }

    /*OnClick event of the radio buttons of pie chart*/
    var pie_clicked_element = [];
    window.check_pie = function(element){
        if (element == "language") {
            document.getElementById("piechartdiag").type = 'lang';
        }
        else if (element == "sentiment") {
            document.getElementById("piechartdiag").type = 'sentiment';
        }
        else {
            document.getElementById("piechartdiag").type = 'gender';
        }
        pie_clicked_element = [];
        pie_clicked_element.push(element);
        // console.log("in check_y_line",element,y_line_clicked_element);
    };

    /*OnClick event of the get visualization button of line chart*/
    $scope.regenerateLineViz = function() {
        $.each($scope.tweets[0],function(k,value){
            if($scope.x_line_tweets.indexOf(k)>=0 && x_line_clicked_element.indexOf(k)>=0){
                x_checked_element = k
                console.log("in on click", k)
            }
            if($scope.y_line_tweets.indexOf(k)>=0 && y_line_clicked_element.indexOf(k)>=0){
                y_checked_element = k
            }
        });

        /*Updating plotData so that new visualization can be loaded*/
        $scope.plotData  = make_2d_Data($scope.tweets, x_checked_element, y_checked_element);
    }

    var old_x_bar_clicked_element = []
    var old_y_bar_clicked_element = []
    /*OnClick event of the get visualization button of bar chart*/
    var regenerateBarViz = function() {
        var make_call = false;
        $.each($scope.tweets[0],function(k,value){
            if ($scope.bar_x_met.indexOf(k)>=0 && x_bar_clicked_element.indexOf(k)>=0){
                x_checked_element = k;
                if (old_x_bar_clicked_element.length==0 || old_x_bar_clicked_element.indexOf(k)<0) {
                    old_x_bar_clicked_element = [];
                    old_x_bar_clicked_element.push(k);

                    make_call = true;
                }
            }
            if ($scope.bar_y_met.indexOf(k)>=0 && y_bar_clicked_element.indexOf(k)>=0){
                y_checked_element = k;
                if (old_y_bar_clicked_element.length==0 || old_y_bar_clicked_element.indexOf(k)<0) {
                    old_y_bar_clicked_element = [];
                    old_y_bar_clicked_element.push(k);

                    make_call = true;
                }
            }
        });
        if (make_call == true) {
            /*Updating plotData so that new visualization can be loaded*/
            //$scope.plotData  = make_2d_Data($scope.tweets, x_checked_element, y_checked_element);
            make_gender_data($scope.tweets, x_checked_element, y_checked_element);
        }
    }

    /*OnClick event of the get visualization button of pie chart*/
    $scope.regeneratePieViz = function() {
        $.each($scope.tweets[0],function(k,value){
            //if ($scope.pie_tweets.indexOf(k)>=0 && pie_clicked_element.indexOf(k)>=0){
            //    x_checked_element = k
            //}
        });

        /*Updating plotData so that new visualization can be loaded*/
        // $scope.plotData  = make_2d_Data($scope.tweets, x_checked_element, y_checked_element);
    };
    var make_gender_data = function (rawdata, xCol, yCol){
            var dict = {};
            for(var i=0;i<rawdata.length;i++){
            var obj = rawdata[i];
            if (!(obj[xCol] in dict)){
                var arr = [0,0]
                dict[obj[xCol]] = arr;
            }
            if (obj["gender"] == "male")
                dict[obj[xCol]][0]++;
            else
                dict[obj[xCol]][1]++;
        }

        var data_m = [];
        var data_f = [];
        for (key in dict){
            if (dict.hasOwnProperty(key)) {
                data_m.push({"x": key, "y": dict[key][0]});
                data_f.push({"x": key, "y": dict[key][1]});
            }
        }
        $scope.data_m = data_m;
        $scope.data_f = data_f;
    };
    make_gender_data($scope.tweets, "minutes", "gender");
    /*
    var x_line_checked_count = 0;
    var x_line_clicked_element = [];
    $scope.check_x_line = function(element){
        var x_contains_element = x_line_clicked_element.indexOf(element);
        if(x_contains_element>=0){
            x_line_checked_count = x_line_checked_count-1;
            x_line_clicked_element.splice(x_contains_element, 1);
        }
        else{
            x_line_checked_count = x_line_checked_count+1;
            x_line_clicked_element.push(element);
        }
        console.log("in check_x_line",element,x_line_checked_count,x_contains_element,x_line_clicked_element);
        if (x_line_checked_count==1){

            $.each($scope.tweets[0],function(k,value){
                var ui_label = k+"_line"
                if($scope.x_line_tweets.indexOf(k)>=0 && x_line_clicked_element.indexOf(k)<0){
                    $("#" + ui_label).attr("disabled",true);
                }
            });
        }
        else{
            $.each($scope.tweets[0],function(k,value){
                var ui_label = k+"_line"
                if($scope.x_line_tweets.indexOf(k)>=0 && x_line_clicked_element.indexOf(k)<0){
                    $("#" + ui_label).attr("disabled",false);
                }
            });
        }
    };

    var y_line_checked_count = 0;
    var y_line_clicked_element = [];
    $scope.check_y_line = function(element){
        var y_contains_element = y_line_clicked_element.indexOf(element);
        if(y_contains_element>=0){
            y_line_checked_count = y_line_checked_count-1;
            y_line_clicked_element.splice(y_contains_element, 1);
        }
        else{
            y_line_checked_count = y_line_checked_count+1;
            y_line_clicked_element.push(element);
        }
        console.log("in check_y_line",element,y_line_checked_count,y_contains_element,y_line_clicked_element);
        if (y_line_checked_count==1){

            $.each($scope.tweets[0],function(k,value){
                var ui_label = k+"_line"
                if($scope.y_line_tweets.indexOf(k)>=0 && y_line_clicked_element.indexOf(k)<0){
                    $("#" + ui_label).attr("disabled",true);
                }
            });
        }
        else{
            $.each($scope.tweets[0],function(k,value){
                var ui_label = k+"_line"
                if($scope.y_line_tweets.indexOf(k)>=0 && y_line_clicked_element.indexOf(k)<0){
                    $("#" + ui_label).attr("disabled",false);
                }
            });
        }
    };

    var x_bar_checked_count = 0;
    var x_bar_clicked_element = [];
    $scope.check_x_bar = function(element){
        var x_contains_element = x_bar_clicked_element.indexOf(element);
        if(x_contains_element>=0){
            x_bar_checked_count = x_bar_checked_count-1;
            x_bar_clicked_element.splice(x_contains_element, 1);
        }
        else{
            x_bar_checked_count = x_bar_checked_count+1;
            x_bar_clicked_element.push(element);
        }
        console.log("in check_x_bar",element,x_bar_checked_count,x_contains_element,x_bar_clicked_element);
        if (x_bar_checked_count==1){

            $.each($scope.tweets[0],function(k,value){
                var ui_label = k+"_bar"
                if($scope.x_bar_tweets.indexOf(k)>=0 && x_bar_clicked_element.indexOf(k)<0){
                    $("#" + ui_label).attr("disabled",true);
                }
            });
        }
        else{
            $.each($scope.tweets[0],function(k,value){
                var ui_label = k+"_bar"
                if($scope.x_bar_tweets.indexOf(k)>=0 && x_bar_clicked_element.indexOf(k)<0){
                    $("#" + ui_label).attr("disabled",false);
                }
            });
        }
    };

    var y_bar_checked_count = 0;
    var y_bar_clicked_element = [];
    $scope.check_y_bar = function(element){
        var y_contains_element = y_bar_clicked_element.indexOf(element);
        if(y_contains_element>=0){
            y_bar_checked_count = y_bar_checked_count-1;
            y_bar_clicked_element.splice(y_contains_element, 1);
        }
        else{
            y_bar_checked_count = y_bar_checked_count+1;
            y_bar_clicked_element.push(element);
        }
        console.log("in check_y_bar",element,y_bar_checked_count,y_contains_element,y_bar_clicked_element);
        if (y_bar_checked_count==1){

            $.each($scope.tweets[0],function(k,value){
                var ui_label = k+"_bar"
                if($scope.y_bar_tweets.indexOf(k)>=0 && y_bar_clicked_element.indexOf(k)<0){
                    $("#" + ui_label).attr("disabled",true);
                }
            });
        }
        else{
            $.each($scope.tweets[0],function(k,value){
                var ui_label = k+"_bar"
                if($scope.y_bar_tweets.indexOf(k)>=0 && y_bar_clicked_element.indexOf(k)<0){
                    $("#" + ui_label).attr("disabled",false);
                }
            });
        }
    };

    var pie_checked_count = 0;
    var pie_clicked_element = [];
    $scope.check_pie = function(element){
        var contains_element = pie_clicked_element.indexOf(element);
        if(contains_element>=0){
            pie_checked_count = pie_checked_count-1;
            pie_clicked_element.splice(contains_element, 1);
        }
        else{
            pie_checked_count = pie_checked_count+1;
            pie_clicked_element.push(element);
        }
        console.log("in check_pie",element,pie_checked_count,contains_element,pie_clicked_element);
        if (pie_checked_count==1){

            $.each($scope.tweets[0],function(k,value){
                var ui_label = k+"_pie"
                if($scope.pie_tweets.indexOf(k)>=0 && pie_clicked_element.indexOf(k)<0){
                    $("#" + ui_label).attr("disabled",true);
                }
            });
        }
        else{
            $.each($scope.tweets[0],function(k,value){
                var ui_label = k+"_pie"
                if($scope.pie_tweets.indexOf(k)>=0 && pie_clicked_element.indexOf(k)<0){
                    $("#" + ui_label).attr("disabled",false);
                }
            });
        }
    };
    */
    $scope.dump=[];
    angular.forEach($scope.tweets,function(d,i){
        $scope.children={
            label:"Image",
            population: d.followers_count,
            screenname: d.screenname,
            //url: d.profile_image_url_https.slice(0, d.profile_image_url_https.lastIndexOf("_")) + d.profile_image_url_https.slice(d.profile_image_url_https.lastIndexOf("."))
            url:d.profile_image_url_https
        }
        $scope.dump.push($scope.children);
        $scope.dump.sort(function(a, b) {
            return b.population - a.population;
        });

    });
    $scope.user=[];
    $scope.collection=[];
    var counter=0;

    $scope.test=[{}]

    $.each($scope.dump, function (index, value) {
        if(counter<50){
            if ($.inArray(value.url, $scope.collection) == -1) {
                $scope.user.push(value.screenname);
                $scope.collection.push(value);
                counter++;

            }};
    });

    console.log($scope.collection);
    //angular.forEach($scope.dump,function(d,i){
    //    if(i<5){
    //        $.each(json_all, function (index, value) {
    //            if ($.inArray(value.id, arr) == -1) {
    //                $scope.user.push(value.id);
    //                $scope.collection.push(value);
    //            }
    //        });
    //   // $scope.user.push(d)
    //   }
    //});


    $scope.gauge = {
        name: 'Positive Tweets',
        opacity: 0.55,
        value: 65,
        text: 'Sentiment Analysis'
    };

    $interval(function(){
        $scope.gauge.value= Math.round(Math.random()*100);
    }, 5000);

    $scope.populationData={
        label:"tree",
        children:$scope.collection
    };
    //$scope.populationData = undefined;
    //
    //$scope.loadData = function () {
    //    console.log("Inside load")
    //    $scope.populationData = {
    //        label: 'United Kingdom',
    //        population: 63181775,
    //        children: [
    //            {
    //                label: 'England',
    //                population: 53012456
    //            },
    //            {
    //                label: 'Scotland',
    //                population: 5295000
    //            },
    //            {
    //                label: 'Wales',
    //                population: 3063456
    //            },
    //            {
    //                label: 'Northern Ireland',
    //                population: 1810863
    //            }
    //        ]
    //    };
    //};
    //
    //$scope.updateData = function () {
    //    $scope.populationData = {
    //        label: 'United Kingdom',
    //        population: 63181775,
    //        children: [
    //            {
    //                label: 'England',
    //                population: 5301245
    //            },
    //            {
    //                label: 'London',
    //                population: 2308000
    //            },
    //            {
    //                label: 'Wales',
    //                population: 3063456
    //            },
    //            {
    //                label: 'Northern Ireland',
    //                population: 1810863
    //            }
    //        ]
    //    };
    //};
    //
    //$scope.clearData = function () {
    //    $scope.populationData = undefined;
    //};

    $("[data-toggle=popover1d]").popover({
        html: true,
        content: function () {


            return $('#1D').html();
        }
    });
    $("[data-toggle=popover1m]").popover({
        html: true,
        content: function () {


            return $('#1M').html();
        }
    });
    $("[data-toggle=popover2d]").popover({
        html: true,
        content: function () {


            return $('#2D').html();
        }
    });
    $("[data-toggle=popover2m]").popover({
        html: true,
        content: function () {


            return $('#2M').html();
        }
    });
    $("[data-toggle=popover3d]").popover({
        html: true,
        content: function () {


            return $('#3D').html();
        }
    });
    //$("[data-toggle=popover3m]").popover({
    //    html: true,
    //    content: function () {
    //
    //
    //        return $('#popover-content').html();
    //    }
    //});

    /* $interval(function(){
     var x=$scope.yData.length+1;
     var y= Math.round(Math.random() * 100);
     $scope.yData.push({x: x, y:y});
     }, 1000, 10);*/

}]);
