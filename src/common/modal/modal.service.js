class ModalService {
    constructor($modal) {
        this.$modal = $modal;
        this.defaultParams = {
            animation: 'am-fade-and-scale',
            placement: 'center',
            controllerAs: '$ctrl'
        };
    }
    open(params) {
        let openParams = _.assign(this.defaultParams, params);
        return this.$modal(openParams);
    }
}

export default angular.module('mpdxApp.services.modal', [])
    .service('modal', ModalService).name;
