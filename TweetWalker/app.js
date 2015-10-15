/**
 * Created by Abir on 10/15/15.
 */

var tweetApp = angular.module('TweetApp',['ui.router']);

tweetApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            controller: 'HomeCtrl'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'dashboard.html',
            controller:'DashboardCtrl'

        })


});