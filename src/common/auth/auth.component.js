import config from 'config';
import { isEmpty } from 'lodash/fp';

class AuthController {
    constructor(
        $http, $location, $log, $window,
        $state, $stateParams
    ) {
        this.$http = $http;
        this.$location = $location;
        this.$log = $log;
        this.$window = $window;
        this.$state = $state;
        this.$stateParams = $stateParams;
    }
    $onInit() {
        if (!isEmpty(this.$stateParams.access_token)) {
            return this.$http.get(
                `${config.authUrl}api/oauth/ticket`,
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
                this.convertTicketToJWT(data.data.ticket);
            }).catch((err) => {
                this.$state.go('logout');
                throw err;
            });
        }
    }
    convertTicketToJWT(ticket) {
        return this.$http.post(
            `${config.apiUrl}user/authenticate`,
            {
                data: {
                    type: 'authenticate',
                    attributes: {
                        cas_ticket: ticket
                    }
                }
            },
            {
                headers: {
                    Accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json'
                },
                skipAuthorization: true
            }
        ).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('user/authenticate', data);
            this.$window.localStorage.setItem('token', data.data.data.attributes.json_web_token);
            const redirect = angular.copy(this.$window.localStorage.getItem('redirect'));
            const params = angular.copy(JSON.parse(this.$window.localStorage.getItem('params')) || {});
            this.$window.localStorage.removeItem('redirect');
            this.$window.localStorage.removeItem('params');
            if (redirect) {
                this.$location.search(params);
                this.$location.path(redirect);
            } else {
                this.$state.go('home', params, { reload: true });
            }
        }).catch((err) => {
            this.$state.go('logout');
            throw err;
        });
    }
}

const Auth = {
    controller: AuthController,
    template: require('./auth.html')
};

import uiRouter from '@uirouter/angularjs';

export default angular.module('mpdx.common.auth.component', [
    uiRouter
]).component('auth', Auth).name;
