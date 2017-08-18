import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';
import moment from 'moment';

class AnniversariesController {
    constructor(
        contacts, locale
    ) {
        this.contacts = contacts;
        this.locale = locale;

        this.limit = 5;
    }
    partialDateSort(value) {
        let sortval = defaultTo(0, get('people[0].anniversary_month', value)) * 100;
        if (sortval > 1100 && moment().month() === 11 && moment().date() > 20) { // reset for dec/jan sorting
            sortval = 0;
        }
        sortval += defaultTo(0, get('people[0].anniversary_day', value));
        return parseInt(sortval);
    }
}

const Anniversaries = {
    controller: AnniversariesController,
    template: require('./anniversaries.html')
};


import contacts from 'contacts/contacts.service';
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.home.care.anniversaries', [
    contacts, locale
]).component('anniversaries', Anniversaries).name;
