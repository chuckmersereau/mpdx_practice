function chosenDirective(
) {
    return {
        link: (scope, element) => {
            //bad index fix
            scope.$watch(() => element[0].length, (newvalue, oldvalue) => {
                if (newvalue !== oldvalue) {
                    element.trigger("chosen:updated");
                }
            });
        }
    };
}
export default angular.module('mpdx.common.chosen', [])
    .directive('chosen', chosenDirective).name;