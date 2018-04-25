// class DrawerController {
//
// }

const Drawer = {
    template: require('./drawer.html'),
    // controller: DrawerController,
    bindings: {
        title: '@',
        onClose: '&'
    },
    transclude: true
};

export default angular.module('mpdx.common.drawer.component', [])
    .component('sideDrawer', Drawer).name;
