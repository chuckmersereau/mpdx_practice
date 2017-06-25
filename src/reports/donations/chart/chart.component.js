import map from 'lodash/fp/map';
import round from 'lodash/fp/round';
import sum from 'lodash/fp/sum';
import take from 'lodash/fp/take';
import takeRight from 'lodash/fp/takeRight';
import zip from 'lodash/zip';
import moment from 'moment';

class ChartController {
    inContact;
    constructor(
        $state, $rootScope, $filter, $log, gettextCatalog,
        accounts, api, contacts, blockUI
    ) {
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.$filter = $filter;
        this.$log = $log;
        this.accounts = accounts;
        this.api = api;
        this.contacts = contacts;
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
        this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onChanges() {
        this.load();
    }
    load() {
        if (this.inContact) {
            this.startDate = moment().startOf('month').subtract(23, 'months');
        } else {
            this.startDate = moment().startOf('month').subtract(11, 'months');
        }
        this.endDate = moment().endOf('month');
        let params = {
            startDate: this.startDate,
            endDate: this.endDate
        };
        if (this.inContact && this.contacts.current.donor_accounts) {
            params.donorAccountId = map('id', this.contacts.current.donor_accounts).join();
            if (params.donorAccountId === '') return;
        }
        this.blockUI.start();
        this.getDonationChart(params).then((data) => {
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
            if (this.inContact) {
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
                        stacked: !this.inContact,
                        gridLines: {
                            display: false
                        },
                        barThickness: this.inContact ? 20 : 40
                    }],
                    yAxes: [{
                        stacked: !this.inContact,
                        ticks: {
                            beginAtZero: true
                        },
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

            if (!this.inContact) {
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
    getDonationChart({ startDate = null, endDate = null, donorAccountId = null } = {}) {
        let params = {
            filter: {
                account_list_id: this.api.account_list_id
            }
        };
        if (donorAccountId) {
            params.filter.donor_account_id = donorAccountId;
        }
        if (startDate && endDate && moment.isMoment(startDate) && moment.isMoment(endDate)) {
            params.filter.donation_date = `${startDate.format('YYYY-MM-DD')}..${endDate.format('YYYY-MM-DD')}`;
        }
        return this.api.get('reports/monthly_giving_graph', params).then(data => {
            /* istanbul ignore next */
            this.$log.debug('reports/monthly_giving_graph', data);
            return data;
        });
    }
}

const Chart = {
    controller: ChartController,
    template: require('./chart.html'),
    bindings: {
        inContact: '<'
    }
};

import accounts from 'common/accounts/accounts.service';
import api from 'common/api/api.service';
import blockUI from 'angular-block-ui';
import contacts from 'contacts/contacts.service';
import gettext from 'angular-gettext';
import uiRouter from 'angular-ui-router';

export default angular.module('mpdx.reports.donations.chart.component', [
    blockUI, gettext, uiRouter,
    accounts, api, contacts
]).component('donationsChart', Chart).name;
