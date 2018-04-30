const Caret = {
    template: require('./caret.html'),
    bindings: {
        reverse: '<'
    }
};
export default angular.module('mpdx.common.sortHeaderCaret.component', [])
    .component('sortHeaderCaret', Caret).name;