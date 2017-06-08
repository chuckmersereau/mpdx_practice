class BirthdaysController {
    contacts;

    constructor(
        contacts, locale
    ) {
        this.contacts = contacts;
        this.locale = locale;

        this.limit = 5;
    }
}

const Birthdays = {
    controller: BirthdaysController,
    template: require('./birthdays.html')
};

import contacts from 'contacts/contacts.service';
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.home.care.birthdays', [
    contacts, locale
]).component('birthdays', Birthdays).name;
