/**
 * Created by Abir on 10/15/15.
 */

tweetApp.controller('DashboardCtrl',['$scope','$interval','$window',function ($scope,$interval,$window) {

    $scope.tweets = JSON.parse($window.data);
    console.log("in dashboard",$scope.tweets);
	
	// Getting count of the attributes inside each tweet
	// Object.keys($scope.tweets[0]).length

	$scope.x_line_tweets = ["month", "year", "date", "minutes", "day"]
	$scope.y_line_tweets = ["lang", "text", "value", "screenname"]
	$scope.x_bar_tweets = ["month", "year", "date", "minutes", "day"]
	$scope.y_bar_tweets = ["lang", "text", "value", "screenname"]
	$scope.pie_tweets = ["lang", "text", "value", "screenname"]

    /* Converting chart Data in to 2D data */

    var make_2d_Data = function (data, xCol, yCol) {
        //console.log("in make data");
        //console.log("data is", data);

        var temp = [];

        angular.forEach(data, function (d,i) {
            if (xCol == "date" && yCol == "value")
                this.push({"x": d.date, "y": d.value});
            if (xCol == "minutes" && yCol == "value")
                this.push({"x": d.minutes, "y": d.value});

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
                        this.push({"x": tempX+1, "y": 0})
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

    /*Putting chart data to scope*/

    $scope.plotData  = make_2d_Data($scope.tweets, "minutes", "value");

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
    $scope.gauge = {
        name: 'Positive Tweets',
        opacity: 0.55,
        value: 65,
        text: 'Sentiment Analysis'
    };

    $interval(function(){
        $scope.gauge.value= Math.round(Math.random()*100);
    }, 5000);
    /* $interval(function(){
     var x=$scope.yData.length+1;
     var y= Math.round(Math.random() * 100);
     $scope.yData.push({x: x, y:y});
     }, 1000, 10);*/

}]);
