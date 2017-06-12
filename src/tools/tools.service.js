class ToolsService {
    data;

    constructor(
        gettextCatalog
    ) {
        this.data = [
            {title: gettextCatalog.getString('Goals & Appeals'), icon: 'fa fa-trophy', link: 'tools.goalsAndAppeals', description: gettextCatalog.getString('Set goals, create asks, and track progress for one time needs'), enabled: false},
            {title: gettextCatalog.getString('Import from Google'), icon: 'fa fa-google', link: 'tools.import.google', description: gettextCatalog.getString('Import your contact information from your Google account'), enabled: false, imports: true},
            {title: gettextCatalog.getString('Import from CSV'), icon: 'fa fa-table', link: 'tools.import.csv', description: gettextCatalog.getString('Import contacts you have saved in a CSV file'), enabled: true, imports: true},
            {title: gettextCatalog.getString('Import from TntConnect'), icon: 'fa fa-upload', link: 'tools.import.tnt', description: gettextCatalog.getString('Import your contacts from your TntConnect database'), enabled: true, imports: true},
            {title: gettextCatalog.getString('Fix Commitment Info'), icon: 'fa fa-usd', link: 'tools.fix.commitmentInfo', description: gettextCatalog.getString('Set the correct contacts commitment info for each contact'), enabled: true},
            {title: gettextCatalog.getString('Fix Phone Numbers'), icon: 'fa fa-phone-square', link: 'tools.fix.phoneNumbers', description: gettextCatalog.getString('Set the correct primary phone number for each person'), enabled: true},
            {title: gettextCatalog.getString('Fix Email Addresses'), icon: 'fa fa-envelope-o', link: 'tools.fix.emailAddresses', description: gettextCatalog.getString('Set the correct primary email address for each person'), enabled: true},
            {title: gettextCatalog.getString('Fix Mailing Addresses'), icon: 'fa fa-map', link: 'tools.fix.addresses', description: gettextCatalog.getString('Set the correct primary mailing address for each contact'), enabled: true},
            {title: gettextCatalog.getString('Merge Contacts'), icon: 'fa fa-users', link: 'tools.merge.contacts', description: gettextCatalog.getString('Review and merge duplicate contacts'), enabled: true},
            {title: gettextCatalog.getString('Merge People'), icon: 'fa fa-exchange', link: 'tools.merge.people', description: gettextCatalog.getString('Review and merge duplicate people'), enabled: true}
        ];
    }
}

import gettextCatalog from 'angular-gettext';

export default angular.module('mpdx.tools.service', [
    gettextCatalog
]).service('tools', ToolsService).name;