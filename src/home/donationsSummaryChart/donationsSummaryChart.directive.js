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
    constructor(
        $filter, $log, $scope, gettextCatalog,
        accounts, api, blockUI, currency
    ) {
        $scope.$filter = $filter;
        $scope.$log = $log;
        $scope.accounts = accounts;
        $scope.api = api;
        $scope.currency = currency;
        $scope.gettextCatalog = gettextCatalog;

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
        scope.api.get('reports/monthly_giving_graph').then((data) => {
            scope.$log.debug('reports/monthly_giving_graph', data);
            scope.series = _.map(data.totals, (total, index) => {
                return {
                    name: scope.currency.list[total.currency].name,
                    color: currencyColors[data.totals.length - index - 1],
                    data: _.map(total.month_totals, (val) => parseFloat(val.converted)),
                    cursor: 'pointer'
                };
            });
            let seriesWithClickEvents = _.map(scope.series, (series) => {
                series.events = {
                    click: (event) => {
                        window.location.href = '/donations?start_date=' + data.months_to_dates[event.point.x];
                    }
                };
                return series;
            });
            // const titleText = `
            //     <span style="color:#007398"><%= ${scope.gettextCatalog.getString('Commitments:')} ${number_to_current_currency(pledges, currency: salary_currency)}</span> |
            //     <span style="color:#3eb1c8"><%= j _('Monthly Goal:') %> <%= number_to_current_currency(current_account_list.monthly_goal, currency: salary_currency) %></span> |
            //     <span style="color:#666062"><%= j _('Monthly Average:') %> <%= number_to_current_currency(monthly_average, currency: salary_currency) %></span>`;

            function tooltipFormatter() {
                const totalConverted = this.total;
                const monthlyGoal = data.monthly_goal || 0;
                const percentOfGoal = Math.round(Number(totalConverted) / monthlyGoal * 100) + '%';
                const percentOfAverage = Math.round(Number(totalConverted) / (data.monthly_average || 0) * 100) + '%';

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

    scope.$on('accountListUpdated', () => {
        loadGraph();
    });
}

export default angular.module('mpdx.common.donationSummaryChart', [])
    .directive('donationSummaryChart', donationSummaryChart)
    .controller('donationSummaryChartController', donationSummaryChartController).name;
