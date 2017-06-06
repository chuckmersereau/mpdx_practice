import moment from 'moment';

class ContributionsController {
    contributions;

    constructor(
        $rootScope,
        contributions, locale
    ) {
        this.contributions = contributions;
        this.locale = locale;

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
        this.type = this.type || 'salary';
        this.load();
    }

    load() {
        this.loading = true;
        return this.contributions.load(this.type).then((data) => {
            this.data = data;
            this.loading = false;
        });
    }

    percentage(amount) {
        return this.data.total ? (amount / this.data.total) * 100 : NaN;
    }

    toCSV() {
        return this.contributions.toCSV(this.data);
    }

    moment(str) {
        return moment(str);
    }
}

const Contributions = {
    controller: ContributionsController,
    template: require('./contributions.html'),
    bindings: {
        type: '<'
    }
};

import contributions from './contributions.service';
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.reports.contributions.component', [
    contributions, locale
]).component('contributions', Contributions).name;
