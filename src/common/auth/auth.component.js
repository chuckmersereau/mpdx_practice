import config from 'config';

class AuthController {
    constructor($state, $stateParams, $window, $http, $log) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$window = $window;
        this.$http = $http;
        this.$log = $log;
        this.load();
    }
    load() {
        if (!_.isEmpty(this.$stateParams.access_token)) {
            this.$http.get(`${config.authUrl}api/oauth/ticket`,
                {
                    headers: {
                        Authorization: `Bearer ${this.$stateParams.access_token}`,
                        Accept: 'application/json'
                    },
                    params: {
                        service: `${config.apiUrl}user/authenticate`
                    }
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
                    }
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
