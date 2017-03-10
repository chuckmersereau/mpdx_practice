class RootController {
}
const Root = {
    template: require('./root.html'),
    controller: RootController
};

export default angular.module('mpdx.root.component', [])
    .component('root', Root).name;
