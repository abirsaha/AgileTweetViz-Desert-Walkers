/**
 * Created by Abir on 10/15/15.
 */

tweetApp.controller('DashboardCtrl', function ($scope, $state,$http,$interval, $window) {
console.log("In controller");
       $scope.tweets = JSON.parse($window.data);
//       console.log("Tweets",$scope.tweets);
//    $scope.salesData=[
//        {x: 1,y: 54},
//        {x: 2,y: 66},
//        {x: 3,y: 77},
//        {x: 4,y: 70},
//        {x: 5,y: 60},
//        {x: 6,y: 63},
//        {x: 7,y: 55},
//        {x: 8,y: 47},
//        {x: 9,y: 55},
//        {x: 12,y: 30}
//    ];
    var makedata = function(data,xCol, yCol){
//    console.log("in makedata", data[0].date)
    var temp =[];
    $.each(data,function(i,d){
        if (xCol == "date" && yCol == "value")
            temp.push({"x":d.date,"y": d.value});
        if (xCol == "minutes" && yCol == "value")
            temp.push({"x":d.minutes,"y": d.value});
        //document.getElementById("demo").innerHTML="Paragraph changed."+ d.year +" and" + d.value ;
    });
//    console.log("makedata ki value", temp.x)
    temp.sort(function(a, b) {
    return a.x - b.x;
    });
    retval = [];
    if (temp.length != 0){
        tempx = temp[0].x;
        tempy = 0;
        $.each(temp,function(i,d){
        if (tempx == d.x){
            tempy = tempy + d.y;
        }
            else{
            retval.push({"x":tempx,"y":tempy});
            tempy = 0;
            tempx = d.x;
        }
    })}
//    console.log("return se phele",retval);
return retval;
}
//console.log("yaha ke baad faatega");
    temp = makedata(JSON.parse($window.data), "minutes", "value");
//    console.log("makedata ke baad", temp);
    $scope.salesData= temp;
//    console.log("makedata ke baad", temp);

   /* $interval(function(){
        var x=$scope.yData.length+1;
        var y= Math.round(Math.random() * 100);
        $scope.yData.push({x: x, y:y});
    }, 1000, 10);*/

});
