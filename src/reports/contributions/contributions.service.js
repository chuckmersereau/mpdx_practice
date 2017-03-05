import find from 'lodash/fp/find';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import reject from 'lodash/fp/reject';
import sortBy from 'lodash/fp/sortBy';
import toUpper from 'lodash/fp/toUpper';


class ContributionsService {
    api;
    currency;

    constructor(
        $rootScope, $q, $log,
        api, currency
    ) {
        this.$q = $q;
        this.$log = $log;
        this.api = api;
        this.currency = currency;

        this.salaryContributions = {};
        this.partnerContributions = {};
        this.currencyList = currency.list;

        $rootScope.$on('accountListUpdated', () => {
            this.loadSalaryContributions(true);
            this.loadPartnerContributions(true);
        });
    }

    loadSalaryContributions(reset = false) {
        if (!reset && keys(this.salaryContributions).length > 0) {
            return this.$q.resolve(this.salaryContributions);
        }

        return this.load('reports/salary_currency_donations', this.salaryContributions);
    }

    loadPartnerContributions(reset = false) {
        if (!reset && keys(this.partnerContributions).length > 0) {
            return this.$q.resolve(this.partnerContributions);
        }

        return this.load('reports/donor_currency_donations', this.partnerContributions);
    }

    load(path, contributions) {
        return this.api.get(path, { filter: {account_list_id: this.api.account_list_id} }).then((data) => {
            let total = 0;

            // iterate through currency_groups
            let currencies = reduce((result, value, key) => {
                // iterate through donation_infos
                let currency = angular.copy(this.currencyList[toUpper(key) || "USD"]);

                currency.totals = value.totals;
                currency.donors = map(donor => {
                    // find contact from donor_infos
                    const contact = find({ 'contact_id': donor.contact_id }, data.donor_infos);
                    // build monthly donations
                    const monthlyDonations = map(monthlyDonation => {
                        const donations = map(donation => {
                            return {
                                amount: donation.amount,
                                date: moment(donation.donation_date),
                                currency: this.currencyList[donation.currency]
                            };
                        }, monthlyDonation.donations);
                        return {
                            donations: donations,
                            total: monthlyDonation.total
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
                total += parseFloat(currency.totals.year_converted);
                result.push(currency);
                return result;
            }, [], data.currency_groups);

            currencies = sortBy((c) => parseFloat(`-${c.totals.year_converted}`), currencies);

            // format months as moment
            let years = {};
            const months = map(month => {
                const formattedMonth = moment(month);
                const year = formattedMonth.year();
                years[year] = years[year] || 0;
                years[year] += 1;
                return formattedMonth;
            }, data.months);

            const salaryCurrency = this.currencyList[toUpper(data.salary_currency) || "USD"];

            const returnableContributions = {
                currencies: currencies,
                years: years,
                months: months,
                total: total,
                salaryCurrency: salaryCurrency
            };

            contributions = angular.copy(returnableContributions);
            this.$log.debug(path, contributions);
            return contributions;
        });
    }
}
export default angular.module('mpdx.reports.contributions.service', [])
    .service('contributions', ContributionsService).name;
