import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import constant from 'lodash/fp/constant';
import defaultTo from 'lodash/fp/defaultTo';
import find from 'lodash/fp/find';
import flatten from 'lodash/fp/flatten';
import flatMap from 'lodash/fp/flatMap';
import get from 'lodash/fp/get';
import isNil from 'lodash/fp/isNil';
import map from 'lodash/fp/map';
import moment from 'moment';
import reduce from 'lodash/fp/reduce';
import reduceObject from 'common/fp/reduceObject';
import reject from 'lodash/fp/reject';
import round from 'lodash/fp/round';
import sortBy from 'lodash/fp/sortBy';
import sumBy from 'lodash/fp/sumBy';
import times from 'lodash/fp/times';
import toInteger from 'lodash/fp/toInteger';

class ContributionsController {
    constructor(
        $log, $rootScope,
        gettextCatalog,
        api, donations, serverConstants
    ) {
        this.$log = $log;
        this.api = api;
        this.donations = donations;
        this.gettextCatalog = gettextCatalog;
        this.serverConstants = serverConstants;

        this.data = {};
        this.expanded = false;
        this.loading = false;

        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onInit() {
        /**
            Report Types
            The type binding can be 'partner' or 'salary'
            - Partner
                Partners are grouped by the currency they gave in
                The normal amount and currency fields are used
            - Salary
                Donors are grouped into a single category which is the user's salary currency
                The converted amount and currency fields are used (using 'converted_' prefix)
        **/
        this.type = defaultTo('salary', this.type);
        this.load();
    }
    load() {
        this.loading = true;
        return this.loadAfterServerConstants(this.type);
    }
    loadAfterServerConstants(type) {
        const endpoint = type === 'salary' ? 'reports/salary_currency_donations' : 'reports/donor_currency_donations';
        return this.api.get(endpoint, {
            filter: { account_list_id: this.api.account_list_id }
        }).then((data) => {
            const currencies = this.getSortedCurrencies(type, data);
            this.data = {
                currencies: currencies,
                years: this.buildYears(data.months),
                months: data.months,
                total: sumBy((currency) => parseFloat(currency.totals.year_converted), currencies),
                salaryCurrency: this.serverConstants.data.pledge_currencies[data.salary_currency.toLowerCase()]
            };
            this.$log.debug('parsed report data', this.data);
            this.loading = false;
        });
    }
    buildYears(months) {
        return reduce((result, value) => {
            const year = value.substring(0, 4);
            result[year] = defaultTo(0, result[year]) + 1;
            return result;
        }, {}, months);
    }
    getSortedCurrencies(type, data) {
        return sortBy((c) => parseFloat(`-${c.totals.year_converted}`), this.getCurrencies(type, data));
    }
    getCurrencies(type, data) {
        return reduceObject((result, value, key) => {
            const donors = this.getDonors(data, type, value.donation_infos);
            const totals = this.getDonorTotals(value, donors, data.months);
            const currency = assign(this.serverConstants.data.pledge_currencies[key], {
                totals: totals,
                donors: donors
            });
            return concat(result, currency);
        }, [], data.currency_groups);
    }
    getDonorTotals(value, donors, months) {
        const sumColumn = (column, donors) =>
            sumBy((donor) => donor.monthlyDonations[column].convertedTotal, donors);
        const sumAverages = (donors) =>
            sumBy((donor) => parseInt(defaultTo(0, donor.average)), donors);
        const sumMins = (donors) =>
            sumBy((donor) => parseInt(defaultTo(0, donor.minimum)), donors);
        const sumMaxes = (donors) =>
            sumBy((donor) => parseInt(defaultTo(0, donor.maximum)), donors);
        return assign(value.totals, {
            months: times((index) =>
                sumColumn(index, donors)
                , months.length),
            average: sumAverages(donors),
            minimum: sumMins(donors),
            maximum: sumMaxes(donors)
        });
    }
    getDonors(data, type, info) {
        return sortBy('contact.contact_name',
            map((donor) => {
                return {
                    contact: this.getContact(donor, data),
                    monthlyDonations: this.getMonthlyDonations(type, donor),
                    average: donor.average,
                    maximum: donor.maximum,
                    minimum: donor.minimum,
                    total: donor.total
                };
            }, reject((donor) => isNil(donor.total), info))
        );
    }
    getContact(donor, data) {
        let contact = find({ 'contact_id': donor.contact_id }, data.donor_infos);
        if (contact) {
            const frequencyValue = parseFloat(contact.pledge_frequency);
            const frequency = this.serverConstants.getPledgeFrequency(frequencyValue);
            if (frequency) {
                contact.pledge_frequency = get('value', frequency);
            }
        }
        return contact;
    }
    getMonthlyDonations(type, donor) {
        return map((monthlyDonation) => {
            const convertedTotal = sumBy((amt) => round(amt.converted_amount), monthlyDonation.donations);
            const total = toInteger(sumBy((donation) => parseFloat(donation.amount), monthlyDonation.donations));
            return {
                donations: monthlyDonation.donations,
                total: type === 'salary' ? convertedTotal : total,
                nativeTotal: total,
                convertedTotal: convertedTotal
            };
        }, donor.months);
    }
    percentage(amount) {
        return this.data.total ? (amount / parseFloat(this.data.total)) * 100 : NaN;
    }

    moment(str) {
        return moment(str);
    }
    toCSV() {
        return this.toCSVAfterServerConstants(this.data);
    }
    toCSVAfterServerConstants(contributions) {
        if (!contributions || !contributions.currencies || !contributions.months) {
            return [];
        }

        const columnHeaders = flatten([
            this.gettextCatalog.getString('Partner'),
            this.gettextCatalog.getString('Status'),
            this.gettextCatalog.getString('Pledge'),
            this.gettextCatalog.getString('Average'),
            this.gettextCatalog.getString('Minimum'),
            this.gettextCatalog.getString('Maximum'),
            map((m) => {
                if (!moment.isMoment(m)) {
                    m = moment(m);
                }
                return m.format('MMM YY');
            }, contributions.months),
            this.gettextCatalog.getString('Total (last month excluded from total)')
        ]);

        return flatMap((currency) => {
            const combinedHeaders = [
                [
                    this.gettextCatalog.getString('Currency'),
                    currency.code,
                    currency.symbol
                ],
                columnHeaders
            ];
            const donorRows = map((donor) => {
                const pledgeFreq = get('pledge_frequency', donor.contact) || '';
                const amount = defaultTo(0, donor.contact.pledge_amount) === 0 ? '' : `${currency.symbol}${donor.contact.pledge_amount} ${currency.code} ${pledgeFreq}`;
                return [
                    donor.contact.contact_name,
                    defaultTo('', donor.contact.status),
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
                ...times(constant(''), 2),
                currency.totals.average,
                currency.totals.minimum,
                currency.totals.maximum,
                ...currency.totals.months,
                round(currency.totals.year_converted)
            ];

            return concat(concat(combinedHeaders, donorRows), [totals]);
        }, contributions.currencies);
    }
}

const Contributions = {
    controller: ContributionsController,
    template: require('./contributions.html'),
    bindings: {
        type: '<'
    }
};

import gettextCatalog from 'angular-gettext';
import api from 'common/api/api.service';
import donations from 'reports/donations/donations.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.reports.contributions.component', [
    gettextCatalog,
    api, donations, serverConstants
]).component('contributions', Contributions).name;
