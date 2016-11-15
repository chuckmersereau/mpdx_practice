function authInterceptor($q, $window) {
    return {
        request: (config) => {
            if (config.url.indexOf('http') === 0) { //ensure it is an api call
                if (!$window.session.token) {
                    return $q.reject('noAuth');
                }
                if (config.method === 'GET' && config.url.indexOf('?') > -1) {
                    config.url += '&access_token=' + $window.sessionStorage.token;
                } else {
                    config.url += '?access_token=' + $window.sessionStorage.token;
                }

                // For later use if we use bearers in MPDX API
                // config.headers = config.headers || {};
                // if ($window.sessionStorage.token) {
                //     config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                // }
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
