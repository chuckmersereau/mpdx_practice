import assign from 'lodash/fp/assign';

class ModalService {
    constructor($modal, $q) {
        this.$modal = $modal;
        this.$q = $q;
        this.defaultParams = {
            animation: 'am-fade',
            placement: 'center',
            controllerAs: '$ctrl',
            locals: {}
        };
    }
    open(params) {
        let deferred = this.$q.defer();
        let openParams = assign(this.defaultParams, params);
        openParams.onHide = (value) => {
            deferred.resolve(value);
            if (params.onHide) {
                params.onHide(value);
            }
        };
        openParams.locals.success = false;
        this.$modal(openParams);
        return deferred.promise;
    }
}

export default angular.module('mpdxApp.services.modal', [])
    .service('modal', ModalService).name;
