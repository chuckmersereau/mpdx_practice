class AvatarController {
}

const Avatar = {
    controller: AvatarController,
    template: require('./avatar.html'),
    bindings: {
        src: '<'
    }
};

export default angular.module('mpdx.common.avatar.component', [])
    .component('avatar', Avatar).name;
