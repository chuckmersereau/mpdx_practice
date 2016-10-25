function autoFocusDirective(
    $timeout
) {
    return {
        restrict: 'A',
        link: (scope, element) => {
            $timeout(() => {
                element[0].focus();
            }, 300);
        }
    };
}

export default angular.module('mpdx.common.autoFocus.directive', [])
    .directive('autoFocus', autoFocusDirective).name;