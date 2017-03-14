import Highcharts from 'highcharts';
import map from 'lodash/fp/map';
import toLower from 'lodash/fp/toLower';

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
    constructor(
        $filter, $log, $scope, gettextCatalog, $rootScope,
        accounts, api, blockUI, serverConstants
    ) {
        $scope.$filter = $filter;
        $scope.$log = $log;
        $scope.$rootScope = $rootScope;
        $scope.accounts = accounts;
        $scope.api = api;
        $scope.gettextCatalog = gettextCatalog;
        $scope.serverConstants = serverConstants;

        $scope.blockUI = blockUI.instances.get('donationSummaryChart');
        $scope.loaded = false;
    }
}

function linkFn(scope) {
    const currencyColors = [
        '#fdb800',
        '#df7d00',
        '#909b9c',
        '#666062',
        '#36b1ca',
        '#00729a'
    ];

    function loadGraph() {
        scope.blockUI.start();
        scope.api.get('reports/monthly_giving_graph', {filter: {account_list_id: scope.api.account_list_id}}).then((data) => {
            scope.$log.debug('reports/monthly_giving_graph', data);
            scope.series = map((total, index) => {
                return {
                    name: scope.serverConstants.data.pledge_currencies[toLower(total.currency)].code_symbol_string,
                    color: currencyColors[data.totals.length - index - 1],
                    data: map(val => parseFloat(val.converted), total.month_totals),
                    cursor: 'pointer'
                };
            }, data.totals);
            let seriesWithClickEvents = map((series) => {
                series.events = {
                    click: (event) => {
                        window.location.href = '/donations?start_date=' + data.months_to_dates[event.point.x];
                    }
                };
                return series;
            }, scope.series);
            const titleText = `
                <span style="color:#007398">${scope.gettextCatalog.getString('Commitments:')} ${data.pledges}</span> |
                <span style="color:#3eb1c8">${scope.gettextCatalog.getString('Monthly Goal:')}  ${data.monthly_goal}</span> |
                <span style="color:#666062">${scope.gettextCatalog.getString('Monthly Average:')} ${data.monthly_average}</span>`;

            function tooltipFormatter() {
                const totalConverted = this.total;
                const monthlyGoal = data.monthly_goal || 0;
                const percentOfGoal = Math.round(Number(totalConverted) / monthlyGoal * 100) + '%';
                const percentOfAverage = Math.round(Number(totalConverted) / (data.monthly_average || 0) * 100) + '%';

                const numberFilter = scope.$filter("number");
                const formattedTotal = data.salary_currency_symbol +
                    numberFilter(totalConverted, 0) + ' ' + data.salary_currency;

                let s = `
                    <table>
                        <thead>
                            <tr>
                                <th colspan="2" class="text-left"><strong>${this.x}</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${data.multi_currency}</td>
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
                    text: titleText,
                    useHTML: true,
                    style: {
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: map(month => moment(month, 'YYYY-MM-DD').format('MMM'), data.months_to_dates)
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: `${scope.gettextCatalog.getString('Amount')} ${data.salary_currency}`
                    },
                    plotLines: [{
                        value: data.pledges,
                        width: 2,
                        color: "#007398"
                    }, {
                        value: data.monthly_goal || 0,
                        width: 2,
                        color: "#3eb1c8"
                    }, {
                        value: data.monthly_average,
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
    }

    loadGraph();

    scope.$rootScope.$on('accountListUpdated', () => {
        loadGraph();
    });
}

export default angular.module('mpdx.common.donationSummaryChart', [])
    .directive('donationSummaryChart', donationSummaryChart)
    .controller('donationSummaryChartController', donationSummaryChartController).name;
