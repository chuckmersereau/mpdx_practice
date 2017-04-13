class FixController {
}

const Fix = {
    controller: FixController,
    template: require('./fix.html')
};

export default angular.module('mpdx.tools.fix.component', [])
    .component('fix', Fix).name;
