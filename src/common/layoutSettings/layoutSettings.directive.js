class LayoutSettingsController {
    constructor(layoutSettings) {
        this.layoutSettings = layoutSettings;
    }
}

function layoutSettingsDirective() {
    return {
        restrict: 'A',
        controller: LayoutSettingsController,
        controllerAs: '$layoutSettingsCtrl',
        bindToController: true
    };
}

export default angular.module('mpdx.common.layoutSettings.directive', [])
    .directive('layoutSettings', layoutSettingsDirective).name;
