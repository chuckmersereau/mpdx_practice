class AnniversariesController {
    contacts;

    constructor(
        contacts, locale
    ) {
        this.contacts = contacts;
        this.locale = locale;

        this.limit = 5;
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
