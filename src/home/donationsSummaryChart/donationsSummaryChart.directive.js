import Highcharts from 'highcharts';

function donationSummaryChart() {
    return {
        restrict: 'E',
        controller: 'donationSummaryChartController',
        template: require('./donationsSummaryChart.html'),
        controllerAs: '$ctrl',
        scope: true,
        link: linkFn
    };
}

class donationSummaryChartController {
    constructor(gettextCatalog, $scope, accounts, $filter, blockUI) {
        $scope.$filter = $filter;
        $scope.gettextCatalog = gettextCatalog;
        $scope.accounts = accounts;
        $scope.blockUI = blockUI.instances.get('donationSummaryChart');
        $scope.blockUI.start();
        $scope.loaded = false;
    }
}

function linkFn(scope) {
    scope.$on('accountListUpdated', () => {
        scope.accounts.getDonations().then(() => {
            let seriesWithClickEvents = _.map(scope.accounts.donations.series, (series) => {
                series.events = {
                    click: (event) => {
                        window.location.href = '/donations?start_date=' + scope.accounts.donations.months_to_dates[event.point.x];
                    }
                };
                return series;
            });

            function tooltipFormatter() {
                const totalConverted = this.total;
                const monthlyGoal = scope.accounts.donations.monthly_goal || 0;
                const percentOfGoal = Math.round(Number(totalConverted) / monthlyGoal * 100) + '%';
                const percentOfAverage = Math.round(Number(totalConverted) / (scope.accounts.donations.monthly_average || 0) * 100) + '%';

                const numberFilter = scope.$filter("number");
                const formattedTotal = scope.accounts.donations.salary_currency_symbol +
                    numberFilter(totalConverted, 0) + ' ' + scope.accounts.donations.salary_currency;

                let s = `
                    <table>
                        <thead>
                            <tr>
                                <th colspan="2" class="text-left"><strong>${this.x}</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${scope.accounts.donations.multi_currency}</td>
                                <td class="text-right">${formattedTotal}</td>
                            </tr>`;
                if (monthlyGoal > 0) {
                    s += `
                            <tr>
                                <td>${scope.gettextCatalog.getString('% of Monthly Goal')}:</td>
                                <td class="text-right">${percentOfGoal}</td>
                            </tr>`;
                }
                s += `
                            <tr>
                                <td>${scope.gettextCatalog.getString('% of Average')}:</td>
                                <td class="text-right">${percentOfAverage}</td>
                            </tr>
                        </tbody>
                    </table>`;

                return s;
            }

            Highcharts.chart('donations_summary_chart', {
                chart: {
                    type: 'column',
                    height: 250
                },
                title: {
                    text: scope.accounts.donations.title_text,
                    useHTML: true,
                    style: {
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: scope.accounts.donations.x_axis_categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: scope.accounts.donations.y_axis_title
                    },
                    plotLines: [{
                        value: scope.accounts.donations.pledges,
                        width: 2,
                        color: "#007398"
                    }, {
                        value: scope.accounts.donations.monthly_goal || 0,
                        width: 2,
                        color: "#3eb1c8"
                    }, {
                        value: scope.accounts.donations.monthly_average,
                        width: 2,
                        color: "#666062"
                    }]
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    formatter: tooltipFormatter,
                    useHTML: true,
                    shared: false
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: seriesWithClickEvents
            });
            scope.blockUI.stop();
            scope.loaded = true;
        });
    });
}

export default angular.module('mpdx.common.donationSummaryChart', [])
    .directive('donationSummaryChart', donationSummaryChart)
    .controller('donationSummaryChartController', donationSummaryChartController).name;
