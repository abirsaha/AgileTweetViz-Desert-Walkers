
/**
 * Created by Jyotiner on 10/30/15.
 */
tweetApp.directive('genChart',['$parse', '$window', function($parse, $window){

    return{
        restrict:'EA',
        template:"<svg></svg>",
        link: function(scope, elem, attrs){
            var margin = {top:10, right: 50, bottom: 25, left: 60};
            var padding = 0;
            width = $("#viz")[0].offsetWidth,
                height = $("#viz")[0].offsetHeight-123;

            //defining axis variables
            var pathClass="path";

            var xScale, yScale, xAxisGen, yAxisGen, lineFun;
            //getting d3 window in d3
            var d3 = $window.d3;

            //looking for svg element in html
            var rawSvg=elem.find('svg');

            //fetching data to plot here in chartData, it uses camel case
            // for angularJS so we get plotData in chartData(or chart-data)
            //setting parameters for axises
            var exp = $parse(attrs.chartData);
            //var data_m=exp(scope);
            
            var rawdata = scope.tweets;
            var dict = {};
            for(var i=0;i<rawdata.length;i++){
            var obj = rawdata[i];
            if (!(obj["minutes"] in dict)){
                var arr = [0,0]
                dict[obj["minutes"]] = arr;
            }
            if (obj["gender"] == "male")
                dict[obj["minutes"]][0]++;   
            else
                dict[obj["minutes"]][1]++;
        }
             
        var data_m = [];
        var data_f = [];
        for (key in dict){
            if (dict.hasOwnProperty(key)) {
                data_m.push({"x": key, "y": dict[key][0]});
                data_f.push({"x": key, "y": dict[key][1]});
            }
        }
    }]);
        