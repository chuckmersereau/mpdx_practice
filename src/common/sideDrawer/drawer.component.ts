const Drawer = {
    template: require('./drawer.html'),
    bindings: {
        title: '@',
        onClose: '&'
    },
    transclude: true
};

export default angular.module('mpdx.common.drawer.component', [])
    .component('sideDrawer', Drawer).name;
