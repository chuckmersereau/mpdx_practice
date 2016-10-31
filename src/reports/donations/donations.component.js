class CurrencyDonationsReportController {
    constructor(api, state, monthRange, layoutSettings, gettextCatalog) {
        this.api = api;
        this.gettextCatalog = gettextCatalog;
        this.layoutSettings = layoutSettings;
        this.monthRange = monthRange;
        this.state = state;

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

        // Expand all columns
        this.expanded = this.expanded || false;

        this.monthsToShow = 13;
        this.sumOfAllCurrenciesConverted = 0;

        this.errorOccurred = false;
        this.loading = true;
        this.allMonths = monthRange.getPastMonths(this.monthsToShow);
        this.years = monthRange.yearsWithMonthCounts(this.allMonths);
        this.currencyGroups = [];
    }
    $onInit() {
        var url = 'reports/year_donations?account_list_id=' + this.state.current_account_list_id;
        this.api.get(url).then((data) => {
            this.useConvertedValues = this.type === 'salary';
            this.currencyGroups = this.parseReportInfo(data.report_info, this.allMonths);
            this.sumOfAllCurrenciesConverted = _.sumBy(this.currencyGroups, 'yearTotalConverted');
            this.loading = false;
        }).catch(() => {
            this.errorOccurred = true;
            this.loading = false;
        });
    }
    parseReportInfo(reportInfo, allMonths) {
        _.mixin({
            groupDonationsByCurrency: this.groupDonationsByCurrency,
            groupDonationsByDonor: this.groupDonationsByDonor,
            aggregateDonationsByMonth: this.aggregateDonationsByMonth,
            aggregateDonorDonationsByYear: this.aggregateDonorDonationsByYear
        });

        return _(reportInfo.donations)
        // Filter out donations that are before the monthsToShow range
            .filter((donation) => moment(donation.donation_date).isSameOrAfter(this.monthRange.getStartingMonth(this.monthsToShow)))
            .groupDonationsByCurrency()
            .map((currencyGroup) => this.processCurrencyGroup(currencyGroup, reportInfo.donors, allMonths))
            .orderBy('yearTotalConverted', 'desc')
            .value();
    }
    processCurrencyGroup(currencyGroup, rawDonors, allMonths) {
        const donors = _(rawDonors)
            .groupDonationsByDonor(currencyGroup.donations)
            .filter('donations')
            // removes donors with no donations in current currency
            .sortBy('donorInfo.name')
            .map((donor) => {
                // parse each donor's donations
                donor.donations = _(donor.donations)
                    .aggregateDonationsByMonth()
                    .value();

                return donor;
            })
            .aggregateDonorDonationsByYear()
            .map((donor) => {
                donor.donations = this.addMissingMonths(donor.donations, allMonths);

                return donor;
            })
            .value();
        const monthlyTotals = this.sumMonths(donors, allMonths);
        // Exclude last month since it may be incomplete
        const monthlyTotalsWithoutCurrentMonth = _.dropRight(monthlyTotals, 1);

        return {
            currency: currencyGroup.currency,
            currencyConverted: currencyGroup.currencyConverted,
            currencySymbol: currencyGroup.currencySymbol,
            currencySymbolConverted: currencyGroup.currencySymbolConverted,
            donors: donors,
            monthlyTotals: monthlyTotals,
            yearTotal: _.sumBy(monthlyTotalsWithoutCurrentMonth, 'amount'),
            yearTotalConverted: _.sumBy(monthlyTotalsWithoutCurrentMonth, 'amountConverted')
        };
    }
    groupDonationsByCurrency(donations) {
        const groupedDonationsByCurrency = _.groupBy(donations, this.useConvertedValues ? 'converted_currency' : 'currency');

        return _.map(groupedDonationsByCurrency, (donationsToGroup) => {
            return {
                currency: donationsToGroup[0].currency,
                currencyConverted: donationsToGroup[0].converted_currency,
                currencySymbol: donationsToGroup[0].currency_symbol,
                currencySymbolConverted: donationsToGroup[0].converted_currency_symbol,
                donations: donationsToGroup
            };
        });
    }
    groupDonationsByDonor(donors, donations) {
        const groupedDonations = _.groupBy(donations, 'contact_id');

        return _.map(donors, (donor) => {
            return {
                donorInfo: donor,
                donations: groupedDonations[donor.id]
            };
        });
    }
    aggregateDonationsByMonth(donations) {
        return _(donations)
            .groupBy((donation) => moment(donation.donation_date).format('YYYY-MM'))
            .map((donationsInMonth, month) => {
                return {
                    amount: _.sumBy(donationsInMonth, 'amount'),
                    amountConverted: _.sumBy(donationsInMonth, 'converted_amount'),
                    currency: donationsInMonth[0].currency,
                    currencyConverted: donationsInMonth[0].converted_currency,
                    currencySymbol: donationsInMonth[0].currency_symbol,
                    currencySymbolConverted: donationsInMonth[0].converted_currency_symbol,
                    donation_date: month,
                    rawDonations: donationsInMonth
                };
            })
            .value();
    }
    aggregateDonorDonationsByYear(donors) {
        return _.map(donors, function(donor) {
            // Filter out current month which may not be complete for every donor
            var donationsWithoutCurrentMonth = _.filter(donor.donations, function(donation) {
                return !moment().isSame(donation.donation_date, 'month');
            });

            // Calculate the average based on the first gift the partner made this year
            // which works better for people who started giving recently.
            var firstDonationMonth = _.minBy(donor.donations, 'donation_date').donation_date;
            // Diff purposely excludes current month
            var donationMonths = moment().diff(firstDonationMonth, 'months');

            var sum = _.sumBy(donationsWithoutCurrentMonth, 'amount');
            var sumConverted = _.sumBy(donationsWithoutCurrentMonth, 'amountConverted');
            var minDonation = _.minBy(donor.donations, 'amount');
            var minDonationConverted = _.minBy(donor.donations, 'amountConverted');

            return _.assign(donor, {
                aggregates: {
                    sum: sum,
                    average: sum / donationMonths,
                    min: minDonation ? minDonation.amount : 0
                },
                aggregatesConverted: {
                    sum: sumConverted,
                    average: sumConverted / donationMonths,
                    min: minDonationConverted ? minDonation.amountConverted : 0
                }
            });
        });
    }
    addMissingMonths(donations, allMonths) {
        return _.map(allMonths, (date) => {
            var existingDonation = _.find(donations, (donation) => moment(donation.donation_date).isSame(date, 'month'));
            if (existingDonation) {
                return existingDonation;
            }

            return {
                amount: 0,
                amountConverted: 0,
                donation_date: moment(date).format('YYYY-MM')
            };
        });
    }
    sumMonths(donors, allMonths) {
        var emptyMonthlyTotals = _.map(allMonths, () => {
            return {
                amount: 0,
                amountConverted: 0
            };
        });

        return _.reduce(donors, (months, donor) => {
            _.forEach(donor.donations, (donation, index) => {
                months[index].amount += donation.amount;
                months[index].amountConverted += donation.amountConverted;
            });

            return months;
        }, emptyMonthlyTotals);
    }
    percentage(currencyTotal) {
        if (this.sumOfAllCurrenciesConverted === 0) {
            return 0;
        }

        return currencyTotal / this.sumOfAllCurrenciesConverted * 100;
    }
    togglePageWidth() {
        this.expanded = !this.expanded;
        this.layoutSettings.fullWidth = this.expanded;
    }
    currencyGroupsToCSV() {
        var columnHeaders = _.flatten([
            this.getttextCatalog.getString('Partner'),
            this.getttextCatalog.getString('Status'),
            this.getttextCatalog.getString('Pledge'),
            this.getttextCatalog.getString('Average'),
            this.getttextCatalog.getString('Minimum'),
            this.allMonths,
            this.getttextCatalog.getString('Total (last month excluded from total)')
        ]);
        var converted = this.useConvertedValues ? 'Converted' : '';

        return _.flatMap(this.currencyGroups, (currencyGroup) => {
            var combinedHeaders = [
                [
                    this.getttextCatalog.getString('Currency'),
                    currencyGroup['currency' + converted],
                    currencyGroup['currencySymbol' + converted]
                ],
                columnHeaders
            ];
            var donorRows = _.map(currencyGroup.donors, (donor) => {
                return _.concat(
                    donor.donorInfo.name,
                    donor.donorInfo.status,
                    currencyGroup.currencySymbol +
                    (donor.donorInfo.pledge_amount || 0) + ' ' +
                    currencyGroup.currency + ' ' +
                    _.toString(donor.donorInfo.pledge_frequency),
                    _.round(donor['aggregates' + converted].average),
                    donor['aggregates' + converted].min,
                    _.map(donor.donations, 'amount' + converted),
                    donor['aggregates' + converted].sum
                );
            });
            var totals = _.concat(
                this.getttextCatalog.getString('Totals'),
                _.times(4, _.constant('')),
                _.map(currencyGroup.monthlyTotals, 'amount' + converted),
                currencyGroup['yearTotal' + converted]
            );

            return _.concat(combinedHeaders, donorRows, [totals], null);
        });
    }
}

const Donations = {
    controller: CurrencyDonationsReportController,
    template: require('./donations.html'),
    bindings: {
        'type': '@',
        'expanded': '@'
    }
};

export default angular.module('mpdx.reports.donations.component', [])
    .component('currencyDonationsReport', Donations).name;
