class FaCheckboxController {
}

const FaCheckbox = {
    controller: FaCheckboxController,
    template: require('./faCheckbox.html'),
    bindings: {
        checked: '<',
        onToggle: '&'
    },
    transclude: true
};

export default angular.module('mpdx.common.faCheckbox.component', [])
    .component('faCheckbox', FaCheckbox).name;
