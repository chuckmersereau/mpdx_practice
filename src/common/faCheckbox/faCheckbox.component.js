class FaCheckboxController {
    constructor() {
        var ngModel = this.ngModel;
        ngModel.$render = this.onChange.bind(this);
    }
    onChange() {
        this.checked = this.ngModel.$viewValue;
    }
    toggle() {
        this.checked = !this.checked;
        this.ngModel.$setViewValue(this.checked);
    }
}

const FaCheckbox = {
    controller: FaCheckboxController,
    template: require('./faCheckbox.html'),
    require: {
        ngModel: 'ngModel'
    },
    transclude: true
};

export default angular.module('mpdx.common.faCheckbox.component', [])
    .component('faCheckbox', FaCheckbox).name;
