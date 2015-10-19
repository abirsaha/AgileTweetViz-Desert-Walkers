/**
 * Created by Abir on 10/13/15.
 */

tweetApp.controller('HomeCtrl', function ($scope, $state,$timeout,$window) {
console.log("in home controller");


$scope.openOverlay=function(olEl) {


console.log("Inside overlay");
        $oLay = $(olEl);

        if ($('#overlay-shade').length == 0)
            $('body').prepend('<div id="overlay-shade"></div>');

        $('#overlay-shade').fadeTo(300, 0.6, function() {
            var props = {
                oLayWidth       : $oLay.width(),
                scrTop          : $(window).scrollTop(),
                viewPortWidth   : $(window).width()
            };

            var leftPos = (props.viewPortWidth - props.oLayWidth) / 2;

            $oLay
                .css({
                    display : 'block',
                    opacity : 0,
                    top : '-=300',
                    left : leftPos+'px'
                })
                .animate({
                    top : props.scrTop + 40,
                    opacity : 1
                }, 600);
        });

    }

    /*$scope.closeOverlay=function() {
        $('.overlay').animate({
            top : '-=300',
            opacity : 0
        }, 400, function() {
            $('#overlay-shade').fadeOut(300);
            $(this).css('display','none');
        });
    }

 angular.element('#overlay-shade, .overlay a').click(function(e) {
        $scope.closeOverlay();
        if ($(this).attr('href') == '#') e.preventDefault();
    });*/


    // Usage
  /*  angular.element('#submit').bind('click',function(e) {
    console.log("inside submit")
       $scope.openOverlay('#overlay-inAbox');
      // e.preventDefault();
    });
*/


});