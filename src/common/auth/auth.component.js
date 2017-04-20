import config from 'config';
import isEmpty from 'lodash/fp/isEmpty';

class AuthController {
    constructor(
        $http, $log, $state, $stateParams, $window, jwtHelper
    ) {
        this.$http = $http;
        this.$log = $log;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.jwtHelper = jwtHelper;
        this.load();
    }
    load() {
        if (!isEmpty(this.$stateParams.access_token)) {
            this.$http.get(`${config.authUrl}api/oauth/ticket`,
                {
                    headers: {
                        Authorization: `Bearer ${this.$stateParams.access_token}`,
                        Accept: 'application/json'
                    },
                    params: {
                        service: `${config.apiUrl}user/authenticate`
                    },
                    skipAuthorization: true
                }
            ).then((data) => {
                this.$http({
                    url: `${config.apiUrl}user/authenticate`,
                    method: 'post',
                    headers: {
                        Accept: 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json'
                    },
                    data: {
                        data: {
                            type: "authenticate",
                            attributes: {
                                cas_ticket: data.data.ticket
                            }
                        }
                    },
                    skipAuthorization: true
                }).then((data) => {
                    this.$log.debug('user/authenticate', data);
                    this.$window.localStorage.setItem('token', data.data.data.attributes.json_web_token);
                    const redirect = angular.copy(this.$window.localStorage.getItem('redirect') || 'home');
                    const params = angular.copy(this.$window.localStorage.getItem('params') || {});
                    this.$window.localStorage.removeItem('redirect');
                    this.$window.localStorage.removeItem('params');
                    this.$state.go(redirect, params, {reload: true});
                });
            });
        }
    }
}

const Auth = {
    controller: AuthController,
    template: require('./auth.html')
};

export default angular.module('mpdx.common.auth.component', [])
    .component('auth', Auth).name;
