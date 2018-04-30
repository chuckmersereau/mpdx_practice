function rawNumberDirective() {
    return {
        require: 'ngModel',
        link: function(_scope: ng.IScope, _element: JQuery, _attrs: ng.IAttributes, ngModel: any) {
            ngModel.$parsers = [];
            ngModel.$formatters = [];
        }
    };
}
export default angular.module('mpdx.common.rawNumber.directive', [])
    .directive('rawNumber', rawNumberDirective).name;