const Import: ng.IComponentOptions = {
    template: require('./import.html')
};

export default angular.module('mpdx.tools.import.component', [])
    .component('import', Import).name;
