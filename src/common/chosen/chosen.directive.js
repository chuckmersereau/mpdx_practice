function chosenDirective(
    $timeout
) {
    function update(element) {
        $timeout(() => {
            element.trigger('chosen:updated');
        }, 0, false);
    }

    return {
        link: (scope, element) => {
            scope.$watch('vm.contact', () => {
                update(element);
            }, true);
            scope.$watch('$ctrl.contact', () => {
                update(element);
            }, true);
        }
    };
}
export default angular.module('mpdx.common.chosen', [])
    .directive('chosen', chosenDirective).name;