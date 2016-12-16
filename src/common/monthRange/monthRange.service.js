class monthRangeService {
    /** Get current date in format YYYY-MM-DD where DD is the last day of the month */
    getEndOfThisMonth() {
        return moment().format('YYYY-MM') + '-' + moment().daysInMonth();
    }

    /** Get the month that is at the start of a X month range before and including the current month in format YYYY-MM-DD where DD is the first day of the month */
    getStartingMonth(numberOfMonths) {
        // We subtract 1 so that the current month is included
        return moment().subtract(numberOfMonths - 1, 'months').startOf('month').format('YYYY-MM-DD');
    }

    /** Get array of months from any number of months before */
    getPastMonths(numberOfMonths) {
        const numberOfMonthsToGet = numberOfMonths || 12;

        return this.generateMonthRange(this.getStartingMonth(numberOfMonthsToGet), this.getEndOfThisMonth());
    }

    /** Get array of months between dateFrom and dateTo */
    generateMonthRange(startDate, endDate) {
        const formattedStartDate = moment(startDate, 'YYYY-MM-DD');
        const formattedEndDate = moment(endDate, 'YYYY-MM-DD');
        const range = moment.range(formattedStartDate, formattedEndDate);
        const allMonths = [];
        range.by('months', (moment) => {
            allMonths.push(moment.format('YYYY-MM-DD'));
        }, true);

        return allMonths;
    }

    /** Get object of years with values that are the number of months for that year found in range */
    yearsWithMonthCounts(monthRange) {
        return _.reduce(monthRange, (years, month) => {
            var year = moment(month).format('YYYY');
            if (years[year]) {
                years[year] += 1;
            }
            years[year] = years[year] || 1;

            return years;
        }, {});
    }
}

export default angular.module('mpdx.common.monthRange.service', [])
    .service('monthRange', monthRangeService).name;
