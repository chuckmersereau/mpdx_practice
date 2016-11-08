const ModalBig = {
    template: require('./modalBig.html'),
    controller: 'modalController',
    transclude: true
};

export default angular.module('mpdx.common.modal.modalBig', [])
    .component('modalBig', ModalBig).name;