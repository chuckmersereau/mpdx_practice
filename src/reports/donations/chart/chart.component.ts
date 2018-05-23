import 'angular-gettext';
import * as moment from 'moment';
import { get, map, round, sum, take, takeRight } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import { zip } from 'lodash';
import accounts, { AccountsService } from '../../../common/accounts/accounts.service';
import api, { ApiService } from '../../../common/api/api.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import designationAccounts, { DesignationAccountsService } from '../../../common/designationAccounts/designationAccounts.service';
import donations, { DonationsService } from '../donations.service';
import joinComma from '../../../common/fp/joinComma';
import uiRouter from '@uirouter/angularjs';

class ChartController {
    chartData: any;
    colors: any[];
    data: any;
    endDate: moment.Moment;
    inContact: boolean;
    labels: string[];
    loading: boolean;
    options: any;
    series: string[];
    startDate: moment.Moment;
    unConvertedData: any;
    watcher: any;
    watcher2: any;
    watcher3: any;
    constructor(
        private $state: StateService,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private $filter: ng.IFilterService,
        private $log: ng.ILogService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private api: ApiService,
        private contacts: ContactsService,
        private designationAccounts: DesignationAccountsService,
        private donations: DonationsService
    ) {
        this.loading = false;
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
        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });

        this.watcher2 = this.$rootScope.$on('donationUpdated', () => {
            this.load();
        });

        this.watcher3 = this.$rootScope.$on('designationAccountSelectorChanged', () => {
            this.load();
        });
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
        this.watcher3();
    }
    $onChanges() {
        this.load();
    }
    load() {
        this.startDate = this.inContact
            ? moment().startOf('month').subtract(23, 'months')
            : moment().startOf('month').subtract(12, 'months');
        this.endDate = moment().endOf('month');
        let params: any = {
            startDate: this.startDate,
            endDate: this.endDate
        };
        if (this.inContact && this.contacts.current.donor_accounts) {
            params.donorAccountId = map('id', this.contacts.current.donor_accounts).join();
            if (params.donorAccountId === '') {
                this.data = [];
                return this.$q.reject('');
            }
            if (this.contacts.current.pledge_currency) {
                params.displayCurrency = this.contacts.current.pledge_currency;
            }
        }
        if (this.designationAccounts.selected.length > 0) {
            params.designationAccountId = joinComma(this.designationAccounts.selected);
        }
        this.loading = true;
        return this.getDonationChart(params).then((data: any) => {
            this.loading = false;
            this.data = this.mutateData(data);
            this.unConvertedData = this.mutateUnconverted(data);
            this.donations.chartData = data;
            this.$rootScope.$emit('chartDataUpdated');
            if (this.inContact) {
                this.labels = map((month) => moment(month, 'YYYY-MM-DD').format('MMM'), takeRight(12, data.months_to_dates));
                this.series = [this.gettextCatalog.getString('Last Year'), this.gettextCatalog.getString('This Year')];
                const primaryData = map((value) => sum(value), zip(...this.data));
                if (primaryData.length > 0) {
                    this.data = [
                        take(12, primaryData),
                        takeRight(12, primaryData)
                    ];
                }
            } else {
                this.series = map('currency', data.totals);
                this.labels = map((month) => moment(month, 'YYYY-MM-DD').format('MMM YY'), data.months_to_dates);
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
                            labelString: `${this.gettextCatalog.getString('Amount')} (${data.display_currency})`
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
                onClick: (event, legendItem) => this.onClick(event, legendItem),
                tooltips: {
                    callbacks: {
                        label: (tooltipItem, data) => this.generateTooltip(tooltipItem, data)
                    }
                }
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
    generateTooltip(tooltipItem, data) {
        const newVal = get(`[${tooltipItem.index}]`, get(`[${tooltipItem.datasetIndex}]`, this.unConvertedData));
        const label = get('label', data.datasets[tooltipItem.datasetIndex]);
        return newVal <= 0
            ? undefined
            : label
                ? `${label}: ${newVal}`
                : newVal;
    }
    mutateData(data) {
        const roundValues = map((val: any) => (round as any)(val.converted, 2));
        const mapTotals = map((total: any) => roundValues(total.month_totals));
        return mapTotals(data.totals);
    }
    mutateUnconverted(data) {
        const roundValues = map((val: any) => (round as any)(val.amount, 2));
        const mapTotals = map((total: any) => roundValues(total.month_totals));
        return mapTotals(data.totals);
    }
    onClick(event, legendItem) {
        if (legendItem.length === 0 || this.inContact) { return; }
        const startDate = moment(`01 ${legendItem[0]._model.label}`, 'DD MMM YY');
        this.$state.go('reports.donations', { startDate: startDate });
    }
    getDonationChart({
        startDate = null, endDate = null, donorAccountId = null, displayCurrency = null, designationAccountId = null
    } = {}) {
        let params: any = {
            filter: {
                account_list_id: this.api.account_list_id
            }
        };
        if (donorAccountId) {
            params.filter.donor_account_id = donorAccountId;
        }
        if (displayCurrency) {
            params.filter.display_currency = displayCurrency;
        }
        if (designationAccountId) {
            params.filter.designation_account_id = designationAccountId;
        }
        if (startDate && endDate && moment.isMoment(startDate) && moment.isMoment(endDate)) {
            params.filter.donation_date = `${startDate.format('YYYY-MM-DD')}..${endDate.format('YYYY-MM-DD')}`;
        }
        return this.api.get('reports/monthly_giving_graph', params).then((data) => {
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

export default angular.module('mpdx.reports.donations.chart.component', [
    'gettext', uiRouter,
    accounts, api, contacts, designationAccounts, donations
]).component('donationsChart', Chart).name;
