class ReportsController {
    constructor(help) {
        help.suggest([
            '58d3d70ddd8c8e7f5974d3ca',
            '584820bc9033600698177a95',
            '58496cc0c6979106d373bb52',
            '58496f15c6979106d373bb65',
            '58481f069033600698177a78',
            '58481e189033600698177a69',
            '5845ac509033600698176a62',
            '58496d4ec6979106d373bb57',
            '58496e389033600698178180'
        ]);
    }
}

const Reports = {
    controller: ReportsController,
    template: require('./reports.html')
};

export default angular.module('mpdx.reports.component', [])
    .component('reports', Reports).name;
