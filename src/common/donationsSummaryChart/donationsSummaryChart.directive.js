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
    constructor(gettextCatalog, $scope, currentAccountList, $filter) {
        $scope.$filter = $filter;
        $scope.gettextCatalog = gettextCatalog;
        $scope.currentAccountList = currentAccountList;
    }
}

function linkFn(scope) {
    scope.currentAccountList.getDonations().then(() => {
        let seriesWithClickEvents = _.map(scope.currentAccountList.donations.series, (series) => {
            series.events = {
                click: (event) => {
                    window.location.href = '/donations?start_date=' + scope.currentAccountList.donations.months_to_dates[event.point.x];
                }
            };
            return series;
        });

        function tooltipFormatter() {
            const totalConverted = this.total;
            const monthlyGoal = scope.currentAccountList.donations.monthly_goal || 0;
            const percentOfGoal = Math.round(Number(totalConverted) / monthlyGoal * 100) + '%';
            const percentOfAverage = Math.round(Number(totalConverted) / (scope.currentAccountList.donations.monthly_average || 0) * 100) + '%';

            const numberFilter = scope.$filter("number");
            const formattedTotal = scope.currentAccountList.donations.salary_currency_symbol +
                numberFilter(totalConverted, 0) + ' ' + scope.currentAccountList.donations.salary_currency;

            let s = `
                <table>
                    <thead>
                        <tr>
                            <th colspan="2" class="text-left"><strong>${this.x}</strong></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${scope.currentAccountList.donations.multi_currency}</td>
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

        const chart = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'donations_summary_chart',
                height: 250
            },
            title: {
                text: scope.currentAccountList.donations.title_text,
                useHTML: true,
                style: {
                    fontSize: '12px'
                }
            },
            xAxis: {
                categories: scope.currentAccountList.donations.x_axis_categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: scope.currentAccountList.donations.y_axis_title
                },
                plotLines: [{
                    value: scope.currentAccountList.donations.pledges,
                    width: 2,
                    color: "#007398"
                }, {
                    value: scope.currentAccountList.donations.monthly_goal || 0,
                    width: 2,
                    color: "#3eb1c8"
                }, {
                    value: scope.currentAccountList.donations.monthly_average,
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
    });
}

export default angular.module('mpdx.common.donationSummaryChart', [])
    .directive('donationSummaryChart', donationSummaryChart)
    .controller('donationSummaryChartController', donationSummaryChartController).name;
