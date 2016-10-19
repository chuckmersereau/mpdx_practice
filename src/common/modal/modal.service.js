class ModalService {
    constructor($modal) {
        this.$modal = $modal;
        this.defaultParams = {
            template: require('./modal.html'),
            animation: 'am-fade-and-scale',
            placement: 'center',
            controllerAs: '$ctrl'
        };
    }
    open(params) {
        let openParams = _.assign(this.defaultParams, params);
        if (openParams.big) {
            openParams.template = require('./modalBig.html');
        }
        if (_.has(openParams, 'contentTemplate')) {
            openParams.contentTemplate = require('!ngtemplate?relativeTo=src!html!' + openParams.contentTemplate);
        }
        return this.$modal(openParams);
    }
}

export default angular.module('mpdxApp.services.modal', [])
    .service('modal', ModalService).name;
