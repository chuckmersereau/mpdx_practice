function rawNumberDirective() {
    return {
        require: 'ngModel',
        link: function(_scope, _element, _attrs, ngModel) {
            ngModel.$parsers = [];
            ngModel.$formatters = [];
        }
    };
}
export default angular.module('mpdx.common.rawNumber.directive', [])
    .directive('rawNumber', rawNumberDirective).name;