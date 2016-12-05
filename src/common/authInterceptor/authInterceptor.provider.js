function authInterceptor($q, $window) {
    return {
        request: (config) => {
            if (config.url.indexOf('http') === 0) { //ensure it is an api call
                if (!$window.sessionStorage.token) {
                    return $q.reject('noAuth');
                }
                config.headers['Authorization'] = `Bearer ${$window.sessionStorage.token}`;
            }
            return config;
        },
        response: (response) => {
            if (response.status === 401) {
                // handle the case where the user is not authenticated
            }
            return response || $q.when(response);
        }
    };
}

export default angular.module('mpdx.common.authInterceptor', [])
    .factory('authInterceptor', authInterceptor).name;
