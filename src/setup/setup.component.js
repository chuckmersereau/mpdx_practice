const Setup = {
    template: require('./setup.html')
};

export default angular.module('mpdx.setup.component', [])
    .component('setup', Setup).name;