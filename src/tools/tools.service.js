class ToolsService {
    data;

    constructor(
        gettextCatalog
    ) {
        this.data = [
            {title: gettextCatalog.getString('Goals & Appeals'), icon: 'fa fa-trophy', link: 'tools.goalsAndAppeals', description: gettextCatalog.getString('Set goals, create asks, and track progress for one time needs.'), enabled: false},
            {title: gettextCatalog.getString('Import from Google'), icon: 'fa fa-google', link: 'tools.importFromGoogle', description: gettextCatalog.getString('Import your contact information from your Google account.'), enabled: false, imports: true},
            {title: gettextCatalog.getString('Import from CSV'), icon: 'fa fa-table', link: 'tools.importFromCSV', description: gettextCatalog.getString('Import contacts you have saved in a .csv spreadsheet.'), enabled: true, imports: true},
            {title: gettextCatalog.getString('Import from TntConnect'), icon: 'fa fa-upload', link: 'tools.importFromTNT', description: gettextCatalog.getString('Import your TntConnect database into MPDX.'), enabled: true, imports: true},
            {title: gettextCatalog.getString('Fix Commitment Info'), icon: 'fa fa-usd', link: 'tools.fixPartnerStatus', description: gettextCatalog.getString('Help MPDX make sure your contacts commitment info up to date.'), enabled: false},
            {title: gettextCatalog.getString('Fix Phone'), icon: 'fa fa-phone-square', link: 'tools.fixAllData', description: gettextCatalog.getString('Help MPDX set the correct primary Phone for each person.'), enabled: false},
            {title: gettextCatalog.getString('Fix Email Address'), icon: 'fa fa-envelope-o', link: 'tools.fixEmailAddress', description: gettextCatalog.getString('Help MPDX set the correct primary Email for each person.'), enabled: false},
            {title: gettextCatalog.getString('Fix Mailing Address'), icon: 'fa fa-map', link: 'tools.fixMailingAddress', description: gettextCatalog.getString('Help MPDX set the correct primary Address for each contact.'), enabled: false},
            {title: gettextCatalog.getString('Merge Contacts'), icon: 'fa fa-users', link: 'tools.mergeContacts', description: gettextCatalog.getString('Review and merge duplicate contacts in your database.'), enabled: true},
            {title: gettextCatalog.getString('Merge People'), icon: 'fa fa-exchange', link: 'tools.mergePeople', description: gettextCatalog.getString('Review and merge duplicate people in your database.'), enabled: true}
        ];
    }
}

export default angular.module('mpdx.tools.service', [])
    .service('tools', ToolsService).name;
