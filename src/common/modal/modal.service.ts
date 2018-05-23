import { assign } from 'lodash/fp';

export class ModalService {
    defaultParams: any;
    constructor(
        private $modal: mgcrea.ngStrap.modal.IModalService,
        private $q: ng.IQService
    ) {
        this.defaultParams = {
            animation: 'am-fade',
            placement: 'center',
            controllerAs: '$ctrl',
            locals: {}
        };
    }
    open(params: any): ng.IPromise<any> {
        let deferred = this.$q.defer();
        let openParams: any = assign(this.defaultParams, params);
        openParams.onHide = (value) => {
            deferred.resolve();
            if (params.onHide) {
                params.onHide(value);
            }
        };
        openParams.locals.success = false;
        this.$modal(openParams);
        return deferred.promise;
    }
    confirm(message: string, title: string = null): ng.IPromise<any> {
        let deferred = this.$q.defer();
        const params = {
            template: require('./confirm/confirm.html'),
            controller: 'confirmController',
            locals: {
                message: message,
                confirmPromise: deferred,
                title: title
            }
        };
        this.open(params);
        return deferred.promise;
    }
    info(message: string, title: string = null): ng.IPromise<any> {
        let deferred = this.$q.defer();
        const params = {
            template: require('./info/info.html'),
            controller: 'infoController',
            locals: {
                message: message,
                infoPromise: deferred,
                title: title
            },
            onHide: () => {
                deferred.resolve();
            }
        };
        this.open(params);
        return deferred.promise;
    }
}

export default angular.module('mpdxApp.services.modal', [
    'mgcrea.ngStrap'
]).service('modal', ModalService).name;
