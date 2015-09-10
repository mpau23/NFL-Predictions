NflPredictionsApp.run(['$rootScope', '$location', '$cookies', '$http', function($rootScope, $location, $cookies, $http) {        

    // keep user logged in after page refresh

    $rootScope.currentUser = $cookies.get('currentUser');   

    if ($rootScope.currentUser) {            
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.currentUser;        
    }          

    $rootScope.$on('$locationChangeStart', function(event, next, current) { 
        // redirect to login page if not logged in

        var user = $rootScope.currentUser;

        if ($location.path() != '/login' && !$cookies.get('currentUser')) {                
            $location.path('/login');            
        }        
    });    
}]);
