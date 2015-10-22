/**
 * Created by Abir on 10/13/15.
 */

tweetApp.controller('HomeCtrl', ['$scope', function ($scope) {


    /* Adding spinner on home page for rendering on active server call*/

    $scope.openOverlay = function (olEl) {

        var overLay = $(olEl);

        if ($('#overlay-shade').length == 0)
            $('body').prepend('<div id="overlay-shade"></div>');

        $('#overlay-shade').fadeTo(300, 0.6, function () {
            var props = {
                oLayWidth: overLay.width(),
                scrTop: $(window).scrollTop(),
                viewPortWidth: $(window).width()
            };

            var leftPos = (props.viewPortWidth - props.oLayWidth) / 2;

            overLay
                .css({
                    display: 'block',
                    opacity: 0,
                    top: '300',
                    left: leftPos + 'px'
                })
                .animate({
                    top: props.scrTop + 40,
                    opacity: 1
                }, 600);
        });

    };

    /* Method for closing the overlay window*/

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


}]);