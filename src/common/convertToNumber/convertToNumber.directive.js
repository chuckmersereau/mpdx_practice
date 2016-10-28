function convertToNumberDirective() {
    return {
        require: 'ngModel',
        link: (scope, element, attrs, ngModel) => {
            ngModel.$parsers.push((val) => {
                return val ? parseInt(val, 10) : null;
            });
            ngModel.$formatters.push((val) => {
                return val ? '' + val : null;
            });
        }
    };
}

export default angular.module('mpdx.common.convertToNumber.directive', [])
    .directive('convertToNumber', convertToNumberDirective).name;