const ModalHeader = {
    template: require('./header.html'),
    bindings: {
        title: '@',
        onClose: '&'
    }
};

export default angular.module('common.modal.header.component', [])
    .component('modalHeader', ModalHeader).name;