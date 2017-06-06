import concat from 'lodash/fp/concat';
import constant from 'lodash/fp/constant';
import flatten from 'lodash/fp/flatten';
import flatMap from 'lodash/fp/flatMap';
import map from 'lodash/fp/map';
import round from 'lodash/fp/round';
import times from 'lodash/fp/times';
import find from 'lodash/fp/find';
import each from 'lodash/fp/each';
import reject from 'lodash/fp/reject';
import sortBy from 'lodash/fp/sortBy';
import reduceObject from 'common/fp/reduceObject';
import moment from 'moment';

class ContributionsService {
    api;
    serverConstants;

    constructor(
        gettextCatalog,
        api, serverConstants
    ) {
        this.gettextCatalog = gettextCatalog;
        this.api = api;
        this.serverConstants = serverConstants;
    }

    load(type) {
        return this.serverConstants.load().then(() => this.loadAfterServerConstants(type));
    }

    toCSV(contributions) {
        return this.serverConstants.load().then(() => this.toCSVAfterServerConstants(contributions));
    }

    loadAfterServerConstants(type) {
        return this.api.get(
            type === 'salary' ? 'reports/salary_currency_donations' : 'reports/donor_currency_donations',
            { filter: { account_list_id: this.api.account_list_id } }
        ).then((data) => {
            let total = 0;
            // iterate through currency_groups
            let currencies = reduceObject((result, value, key) => {
                // iterate through donation_infos
                let currency = angular.copy(this.serverConstants.data.pledge_currencies[key]);

                currency.totals = value.totals;
                currency.donors = map(donor => {
                    // find contact from donor_infos
                    const contact = find({ 'contact_id': donor.contact_id }, data.donor_infos);
                    // build monthly donations
                    const monthlyDonations = map(monthlyDonation => {
                        let total = 0;
                        let convertedTotal = 0;
                        const donations = map(donation => {
                            const currency = this.serverConstants.data.pledge_currencies[donation.currency.toLowerCase()];
                            let result = {
                                date: donation.donation_date,
                                amount: donation.amount,
                                currency: {
                                    code: currency.code,
                                    symbol: currency.symbol
                                }
                            };

                            total += parseFloat(donation.amount);
                            convertedTotal += parseFloat(donation.converted_amount);
                            return result;
                        }, monthlyDonation.donations);
                        return {
                            donations: donations,
                            total: type === 'salary' ? convertedTotal : total,
                            nativeTotal: total,
                            convertedTotal: convertedTotal
                        };
                    }, donor.months);

                    // add to currency
                    return {
                        contact: contact,
                        monthlyDonations: monthlyDonations,
                        average: donor.average,
                        maximum: donor.maximum,
                        minimum: donor.minimum,
                        total: donor.total
                    };
                }, reject(donor => donor.total == null, value.donation_infos));
                currency.donors = sortBy((donor) => donor.contact.contact_name, currency.donors);
                total += parseFloat(currency.totals.year_converted);
                result.push(currency);
                return result;
            }, [], data.currency_groups);

            currencies = sortBy((c) => parseFloat(`-${c.totals.year_converted}`), currencies);

            let years = {};
            each(month => {
                const year = month.substring(0, 4);
                years[year] = years[year] || 0;
                years[year] += 1;
            }, data.months);

            const contributions = {
                currencies: currencies,
                years: years,
                months: data.months,
                total: total,
                salaryCurrency: this.serverConstants.data.pledge_currencies[(data.salary_currency).toLowerCase()]
            };

            return contributions;
        });
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

        const csv = flatMap(currency => {
            const combinedHeaders = [
                [
                    this.gettextCatalog.getString('Currency'),
                    currency.code,
                    currency.symbol
                ],
                columnHeaders
            ];
            const donorRows = map(donor => {
                const pledgeFreq = this.serverConstants.data.pledge_frequencies[parseFloat(donor.contact.pledge_frequency)] || '';
                let amount = (donor.contact.pledge_amount || 0) === 0 ? '' : `${currency.symbol}${donor.contact.pledge_amount || 0} ${currency.code} ${pledgeFreq}`;
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
        }, contributions.currencies);

        return csv;
    }
}

import gettextCatalog from 'angular-gettext';
import api from 'common/api/api.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.reports.contributions.service', [
    gettextCatalog, api, serverConstants
]).service('contributions', ContributionsService).name;
