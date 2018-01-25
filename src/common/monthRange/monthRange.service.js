import { defaultTo, reduce } from 'lodash/fp';
import moment from 'moment';

class monthRangeService {
    /** Get current date in format YYYY-MM-DD where DD is the last day of the month */
    getEndOfThisMonth() {
        return moment().format('YYYY-MM') + '-' + moment().daysInMonth();
    }
    getStartingMonth(numberOfMonths) {
        // We subtract 1 so that the current month is included
        return moment().subtract(numberOfMonths - 1, 'months').startOf('month').format('YYYY-MM-DD');
    }
    getPastMonths(numberOfMonths) {
        const numberOfMonthsToGet = numberOfMonths || 12;

        return this.generateMonthRange(this.getStartingMonth(numberOfMonthsToGet), this.getEndOfThisMonth());
    }
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
    yearsWithMonthCounts(monthRange) {
        return reduce((result, month) => {
            const year = moment(month).format('YYYY');
            result[year] = defaultTo(0, result[year]) + 1;
            return result;
        }, {}, monthRange);
    }
}

export default angular.module('mpdx.common.monthRange.service', [])
    .service('monthRange', monthRangeService).name;
