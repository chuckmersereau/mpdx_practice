function autofocusDirective(
    $timeout: ng.ITimeoutService
) {
    return {
        restrict: 'A',
        link: (scope: ng.IScope, element: JQuery, attributes: any) => {
            const focus = () => {
                $timeout(() => {
                    element[0].focus();
                }, 300);
            };
            scope.$watch(attributes.autofocus, (value) => {
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
