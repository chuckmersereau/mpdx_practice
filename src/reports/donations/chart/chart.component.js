import map from 'lodash/fp/map';
import round from 'lodash/fp/round';
import sum from 'lodash/fp/sum';
import take from 'lodash/fp/take';
import takeRight from 'lodash/fp/takeRight';
import zip from 'lodash/zip';
import moment from 'moment';

class ChartController {
    contact;
    constructor(
        $state, $rootScope, $filter, $log, gettextCatalog,
        accounts, donations, blockUI
    ) {
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.$filter = $filter;
        this.$log = $log;
        this.accounts = accounts;
        this.donations = donations;
        this.gettextCatalog = gettextCatalog;

        this.blockUI = blockUI.instances.get('donationsChart');
        this.noChart = true;
        this.colors = [
            { backgroundColor: '#fdb800' },
            { backgroundColor: '#df7d00' },
            { backgroundColor: '#909b9c' },
            { backgroundColor: '#666062' },
            { backgroundColor: '#36b1ca' },
            { backgroundColor: '#00729a' }
        ];
    }

    $onInit() {
        this.load();
        this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }

    $onChanges() {
        this.load();
    }

    load() {
        if (this.contact) {
            this.startDate = moment().startOf('month').subtract(23, 'months');
        } else {
            this.startDate = moment().startOf('month').subtract(11, 'months');
        }
        this.endDate = moment().endOf('month');
        let params = {
            startDate: this.startDate,
            endDate: this.endDate
        };
        if (this.contact && this.contact.donor_accounts) {
            params.donorAccountId = map('id', this.contact.donor_accounts).join();
            if (params.donorAccountId === '') return;
        }
        this.blockUI.start();
        this.donations.getDonationChart(params).then((data) => {
            this.blockUI.stop();
            if (data.totals.length === 0) {
                this.hasChart = false;
                return;
            } else {
                this.hasChart = true;
            }
            this.data = map(total => {
                return map(val => round(val.converted, 2), total.month_totals);
            }, data.totals);
            if (this.contact) {
                this.labels = map(month => moment(month, 'YYYY-MM-DD').format('MMM'), takeRight(12, data.months_to_dates));
                this.series = [this.gettextCatalog.getString('Last Year'), this.gettextCatalog.getString('This Year')];
                const primaryData = map(value => sum(value), zip(...this.data));
                this.data = [
                    take(12, primaryData),
                    takeRight(12, primaryData)
                ];
            } else {
                this.series = map('currency', data.totals);
                this.labels = map(month => moment(month, 'YYYY-MM-DD').format('MMM YY'), data.months_to_dates);
            }
            this.options = {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true
                },
                scales: {
                    xAxes: [{
                        stacked: !this.contact,
                        gridLines: {
                            display: false
                        },
                        barThickness: this.contact ? 20 : 40
                    }],
                    yAxes: [{
                        stacked: !this.contact,
                        scaleLabel: {
                            display: true,
                            labelString: `${this.gettextCatalog.getString('Amount')} (${data.salary_currency})`
                        }
                    }]
                },
                annotation: {
                    annotations: [{
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: data.monthly_average,
                        borderColor: '#666062',
                        borderWidth: 2
                    }],
                    drawTime: 'beforeDatasetsDraw'
                },
                onClick: (event, legendItem) => this.onClick(event, legendItem)
            };

            if (!this.contact) {
                this.options.annotation.annotations = this.options.annotation.annotations.concat([{
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: data.pledges,
                    borderColor: '#007398',
                    borderWidth: 2
                }, {
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    value: data.monthly_goal,
                    borderColor: '#3eb1c8',
                    borderWidth: 2
                }]);
            }
            this.chartData = data;
        });
    }

    onClick(event, legendItem) {
        if (legendItem.length === 0) return;
        const startDate = moment(`01 ${legendItem[0]._model.label}`, 'DD MMM YY');
        this.$state.go('reports.donations', { startDate: startDate });
    }
}

const Chart = {
    controller: ChartController,
    template: require('./chart.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.reports.donations.chart.component', [])
    .component('donationsChart', Chart).name;
