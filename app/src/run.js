NflPredictionsApp.run(['$rootScope', '$location', '$cookies', '$http', function($rootScope, $location, $cookies, $http) {        

    // keep user logged in after page refresh
            
    $rootScope.currentUser = $cookies.get('currentUser');   

    if ($rootScope.currentUser) {            
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.currentUser;        
    }          
    $rootScope.$on('$locationChangeStart', function(event, next, current) { 
        // redirect to login page if not logged in
                    
        if ($location.path() !== '/login' && !$rootScope.currentUser) {                
            $location.path('/login');            
        }        
    });    
}]);
