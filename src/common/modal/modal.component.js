const Modal = {
    template: require('./modal.html'),
    controller: 'modalController',
    transclude: true
};

export default angular.module('mpdx.common.modal.component', [])
    .component('modal', Modal).name;