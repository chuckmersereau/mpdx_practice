const Avatar = {
    template: require('./avatar.html'),
    bindings: {
        src: '<'
    }
};

export default angular.module('mpdx.common.avatar.component', [])
    .component('avatar', Avatar).name;
