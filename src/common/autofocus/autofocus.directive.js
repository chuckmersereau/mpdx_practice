function autofocusDirective(
    $timeout
) {
    return {
        restrict: 'A',
        link: (scope, element, attributes) => {
            const focus = () => {
                $timeout(() => {
                    element[0].focus();
                }, 300);
            };
            scope.$watch(attributes.autofocus, function(value) {
                if (value) {
                    focus();
                }
            });
            if (attributes.autofocus === '') {
                focus();
            }
        }
    };
}

export default angular.module('mpdx.common.autofocus.directive', [])
    .directive('autofocus', autofocusDirective).name;
