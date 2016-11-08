class ReportsController {
}

const Reports = {
    controller: ReportsController,
    template: require('./reports.html')
};

export default angular.module('mpdx.reports.component', [])
    .component('reports', Reports).name;