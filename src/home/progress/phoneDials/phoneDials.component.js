class PhoneDialsController {
}

const progressPhoneDials = {
    template: require('./phoneDials.html'),
    controller: PhoneDialsController,
    bindings: {
        phone: '<'
    }
};

export default angular.module('mpdx.home.progress.phoneDials', [])
    .component('progressPhoneDials', progressPhoneDials).name;
