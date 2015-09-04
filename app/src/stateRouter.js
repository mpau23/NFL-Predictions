NflPredictionsApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            name: 'home',
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'RootCtrl'
        })
        .state('teams', {
            name: 'home.teams',
            url: '/teams',
            templateUrl: 'views/teams.html',
            controller: 'TeamsCtrl'
        })
        .state('games', {
            name: 'home.games',
            url: '/games/:week',
            templateUrl: 'views/games.html',
            controller: 'GamesCtrl'
        })
        .state('leaderboard', {
            name: 'home.leaderboard',
            url: '/leaderboard',
            templateUrl: 'views/leaderboard.html',
            controller: 'LeaderboardCtrl'
        })
        .state('login', {
            name: 'home.login',
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        });
}]);
