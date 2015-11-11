NflPredictionsApp.factory('LocalStorageWrapperService', ['localStorageService', function(localStorageService) {

    var localStorageWrapperService = {

        get: function(cacheKey) {
            var itemFromCache = JSON.parse(localStorageService.get(cacheKey));

            if (!itemFromCache) {
                console.log("item not found in cache");
                return null;
            } else {
                var expiry = new Date(itemFromCache.expiry);
                var now = new Date();
                if (expiry > now) {
                    console.log("item retrieved from cache");
                    return itemFromCache.data;
                } else {
                    console.log("cache expired");
                    return null;
                }
            }
        },

        set: function(cacheKey, data, expiryInMinutes) {

            var now = new Date();
            var itemForCache = {
                data: data,
                expiry: now.setMinutes(now.getMinutes() + expiryInMinutes)
            };
            console.log("saving item to cache");
            localStorageService.set(cacheKey, JSON.stringify(itemForCache));
        }

    }

    return localStorageWrapperService;

}]);
