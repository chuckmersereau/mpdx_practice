class ChartController {
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
        this.startDate = this.startDate || moment().startOf('month').subtract(11, 'months');
        this.endDate = this.endDate || moment().endOf('month');
        this.load();
        this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }

    $onChanges() {
        this.load();
    }

    load() {
        let params = {
            startDate: this.startDate,
            endDate: this.endDate
        };
        if (this.contact && this.contact.donor_accounts) {
            params.donorAccountId = _.map(this.contact.donor_accounts, 'id').join();
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
            this.series = _.map(data.totals, (total) => total.currency);
            this.labels = _.map(data.months_to_dates, month => moment(month, 'YYYY-MM-DD').format('MMM YY'));
            this.data = _.map(data.totals, (total) => {
                return _.map(total.month_totals, (val) => parseFloat(val.converted).toFixed(2));
            });
            this.options = {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        gridLines: {
                            display: false
                        },
                        barThickness: 40
                    }],
                    yAxes: [{
                        stacked: true,
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
        this.$state.go('reports.donations', { start_date: startDate, end_date: startDate.endOf('month') });
    }
}

const Chart = {
    controller: ChartController,
    template: require('./chart.html'),
    bindings: {
        contact: '<',
        startDate: '<',
        endDate: '<'
    }
};

export default angular.module('mpdx.reports.donations.chart.component', [])
    .component('donationsChart', Chart).name;
