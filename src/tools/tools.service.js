class ToolsService {
    data;

    constructor(
        gettextCatalog
    ) {
        this.data = [
            {title: gettextCatalog.getString('Goals & Appeals'), icon: 'fa fa-trophy', link: 'tools.goalsAndAppeals', description: gettextCatalog.getString('Set goals,create asks, and track progress for one time needs.'), enabled: true},
            {title: gettextCatalog.getString('Import from Google'), icon: 'fa fa-google', link: 'tools.importFromGoogle', description: gettextCatalog.getString('Import your contact information from your Google account.'), enabled: true},
            {title: gettextCatalog.getString('Import from CSV'), icon: 'fa fa-table', link: 'tools.importFromCSV', description: gettextCatalog.getString('Import contacts you have saved in a .csv spreadsheet.'), enabled: true},
            {title: gettextCatalog.getString('Import from TntConnect'), icon: 'fa fa-bomb', link: 'tools.importFromTNT', description: gettextCatalog.getString('Import your TntConnect database into MPDX.'), enabled: true},
            {title: gettextCatalog.getString('Fix Partner Status'), icon: 'fa fa-usd', link: 'tools.fixPartnerStatus', description: gettextCatalog.getString('Let MPDX make sure you have your contacts status up to date.'), enabled: true},
            {title: gettextCatalog.getString('Fix Phone'), icon: 'fa fa-phone-square', link: 'tools.fixAllData', description: gettextCatalog.getString('Let MPDX make sure you have the correct primary Phone set for a person'), enabled: true},
            {title: gettextCatalog.getString('Fix Email Address'), icon: 'fa fa-envelope-o', link: 'tools.fixEmailAddress', description: gettextCatalog.getString('Let MPDX make sure you have the correct primary Email set for a person.'), enabled: true},
            {title: gettextCatalog.getString('Fix Mailing Address'), icon: 'fa fa-map', link: 'tools.fixMailingAddress', description: gettextCatalog.getString('Let MPDX make sure you have the correct primary Address set for a contact.'), enabled: true},
            {title: gettextCatalog.getString('Merge Contacts'), icon: 'fa fa-users', link: 'contacts.reconcile_partners', description: gettextCatalog.getString('Review and merge duplicate contacts in your database.'), enabled: true},
            {title: gettextCatalog.getString('Merge People'), icon: 'fa fa-user-secret', link: 'contacts.reconcile_individuals', description: gettextCatalog.getString('Review and merge duplicate people in your database.'), enabled: true}
        ];
    }
}

export default angular.module('mpdx.tools.service', [])
    .service('tools', ToolsService).name;
