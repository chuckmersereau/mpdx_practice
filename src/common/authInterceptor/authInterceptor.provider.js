import config from 'config';

function authInterceptor($q, $window, $state) {
    return {
        request: (request) => {
            if (request.url.indexOf('http') === 0) { //ensure it is an api call
                if (!$window.sessionStorage.token &&
                    request.url !== `${config.apiUrl}user/authenticate` &&
                    request.url !== `${config.authUrl}api/oauth/ticket`
                    ) {
                    return $q.reject('noAuth');
                }
                if (request.url !== `${config.authUrl}api/oauth/ticket` && $window.sessionStorage.token) {
                    request.headers['Authorization'] = `Bearer ${$window.sessionStorage.token}`;
                }
            }
            return request;
        },
        response: (response) => {
            return response || $q.when(response);
        },
        responseError: (response) => {
            if (response.status === 401) {
                delete $window.sessionStorage.token;
                if ($state.current.name !== 'login') { $state.go('login'); }
            }
            return $q.reject(response);
        }
    };
}

export default angular.module('mpdx.common.authInterceptor', [])
    .factory('authInterceptor', authInterceptor).name;
