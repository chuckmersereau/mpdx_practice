class ModalService {
    constructor($modal, $q) {
        this.$modal = $modal;
        this.$q = $q;
        this.defaultParams = {
            animation: 'am-fade',
            placement: 'center',
            controllerAs: '$ctrl'
        };
    }
    open(params) {
        var deffered = this.$q.defer();
        let openParams = _.assign(this.defaultParams, params);
        openParams.onHide = () => {
            if (openParams.success) {
                deffered.resolve();
            } else {
                deffered.reject();
            }
        };
        if (!angular.isDefined(openParams.locals)) {
            openParams.locals = {};
        }
        openParams.locals.success = false;
        this.$modal(openParams);
        return deffered.promise;
    }
}

export default angular.module('mpdxApp.services.modal', [])
    .service('modal', ModalService).name;
