/**
 * Created by Abir on 10/13/15.
 */

tweetApp.controller('HomeCtrl', ['$scope','$http','$state','$location', function ($scope,$http,$state,$location) {

    $scope.hashtag;
    /* Adding spinner on home page for rendering on active server call*/

    var openOverlay = function (olEl) {
    console.log('adad');
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

   var closeOverlay=function() {
     $('.overlay').animate({
     top : '-=300',
     opacity : 0
     }, 400, function() {
     $('#overlay-shade').fadeOut(300);
     $(this).css('display','none');
     });
     };

   /*  angular.element('#overlay-shade, .overlay a').click(function(e) {
     $scope.closeOverlay();
     if ($(this).attr('href') == '#') e.preventDefault();
     });*/


    // Usage
   /*   angular.element('#submit').on('click',function(e) {
     console.log("inside submit")
     $scope.openOverlay('#overlay-inAbox');
     // e.preventDefault();
     });*/
    $scope.disabled = true;



    $scope.$watch('hashtag',function(newVal){
        if(newVal != "" && newVal != undefined){
            $scope.disabled = false;

        }
        else{
            $scope.disabled = true;
        }
    });

angular.element('#submit').on('click', function () {
    openOverlay('#overlay-inAbox');
});
/*
    $scope.addItem = function() {
        console.log('Inside item');

        var csrftoken = $.cookie('csrftoken');

        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        jQuery.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        jQuery.ajax({
            type: 'POST',
            url: '',
            data: {'hashtagInput':$scope.hashtag},
            dataType: "json",
            success: function (data) {

            },
            error: function(data) {

            }
        });
        return true;


    };
*/
}]);