const Progressbar = {
    template: require('./progressbar.html'),
    bindings: {
        appeal: '<'
    }
};

export default angular.module('mpdx.tools.appeals.show.progressbar.component', [])
    .component('appealsProgressbar', Progressbar).name;