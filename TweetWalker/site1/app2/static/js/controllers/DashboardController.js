/**
 * Created by Abir on 10/15/15.
 */

tweetApp.controller('DashboardCtrl',['$scope','$interval','$window',function ($scope,$interval,$window) {

    $scope.tweets = JSON.parse($window.data);

    /* Converting chart Data in to 2D data */

    var make_2d_Data = function (data, xCol, yCol) {

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
            },retValue)
        }
        return retValue;
    };

    /*Putting chart data to scope*/

    $scope.plotData  = make_2d_Data($scope.tweets, "minutes", "value");

    /* $interval(function(){
     var x=$scope.yData.length+1;
     var y= Math.round(Math.random() * 100);
     $scope.yData.push({x: x, y:y});
     }, 1000, 10);*/

}]);
