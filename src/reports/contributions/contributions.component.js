import concat from 'lodash/fp/concat';
import constant from 'lodash/fp/constant';
import flatten from 'lodash/fp/flatten';
import flatMap from 'lodash/fp/flatMap';
import map from 'lodash/fp/map';
import round from 'lodash/fp/round';
import times from 'lodash/fp/times';

class ContributionsController {
    gettextCatalog;
    contributions;
    serverConstants;

    constructor(
        gettextCatalog,
        contributions, serverConstants
    ) {
        this.gettextCatalog = gettextCatalog;
        this.contributions = contributions;
        this.serverConstants = serverConstants;

        this.constantsList = {};
        this.expanded = false;
    }
    $onInit() {
        /**
            Report Types
            The type binding can be 'donor' or 'salary'
            - Donor
                Donors are grouped by the currency they gave in
                The normal amount and currency fields are used
            - Salary
                Donors are grouped into a single category which is the user's salary currency
                The converted amount and currency fields are used (using 'converted_' prefix)
        **/
        this.type = this.type || 'salary';
        this.load();
    }
    load() {
        this.loading = true;
        this.loadByType().then(() => {
            this.loading = false;
        });
        this.serverConstants.load().then((data) => {
            this.constantsList = data;
        });
    }
    loadByType() {
        if (this.type === 'salary') {
            return this.contributions.loadSalaryContributions();
        } else {
            return this.contributions.loadPartnerContributions();
        }
    }
    percentage(amount) {
        return (amount / this.contributions.data.total) * 100;
    }
    contributionsToCSV() {
        const columnHeaders = flatten([
            this.gettextCatalog.getString('Partner'),
            this.gettextCatalog.getString('Status'),
            this.gettextCatalog.getString('Pledge'),
            this.gettextCatalog.getString('Average'),
            this.gettextCatalog.getString('Minimum'),
            this.gettextCatalog.getString('Maximum'),
            map((m) => m.format('MMM YY'), this.contributions.data.months),
            this.gettextCatalog.getString('Total (last month excluded from total)')
        ]);

        return flatMap(currency => {
            const combinedHeaders = [
                [
                    this.gettextCatalog.getString('Currency'),
                    currency.code,
                    currency.symbol
                ],
                columnHeaders
            ];
            const donorRows = map(donor => {
                const pledgeFreq = this.constantsList.pledge_frequencies[donor.contact.pledge_frequency];
                const amount = pledgeFreq ? `${currency.symbol}${donor.contact.pledge_amount || 0} ${currency.code} ${pledgeFreq}` : '';
                return [
                    donor.contact.contact_name,
                    donor.contact.status,
                    amount,
                    round(donor.average),
                    donor.minimum,
                    donor.maximum,
                    ...map('total', donor.monthlyDonations),
                    donor.total
                ];
            }, currency.donors);
            const totals = [
                this.gettextCatalog.getString('Totals'),
                ...times(constant(''), 5),
                ...currency.totals.months,
                round(currency.totals.year_converted)
            ];

            return concat(concat(combinedHeaders, donorRows), [totals]);
        }, this.contributions.data.currencies);
    }
}

const Contributions = {
    controller: ContributionsController,
    template: require('./contributions.html'),
    bindings: {
        type: '<'
    }
};

export default angular.module('mpdx.reports.contributions.component', [])
    .component('contributions', Contributions).name;
