NflPredictionsApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home',{
            name: 'home',
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'RootCtrl'
        })
        .state('teams',{
            name: 'home.teams',
            url: '/teams',
            templateUrl: 'views/teams.html',
            controller: 'TeamsCtrl'
        });

}]);