class ToolsService {
    data;

    constructor(
        gettextCatalog
    ) {
        this.data = [
            {title: gettextCatalog.getString('Goals & Appeals'), icon: 'fa fa-trophy', link: 'tools.goalsAndAppeals', description: gettextCatalog.getString('')},
            {title: gettextCatalog.getString('Import from Google'), icon: 'fa fa-google', link: 'tools.importFromGoogle', description: gettextCatalog.getString('')},
            {title: gettextCatalog.getString('Import from CSV'), icon: 'fa fa-table', link: 'tools.importFromCSV', description: gettextCatalog.getString(''), enabled: true},
            {title: gettextCatalog.getString('Import from TNT'), icon: 'fa fa-bomb', link: 'tools.importFromTNT', description: gettextCatalog.getString(''), enabled: true},
            {title: gettextCatalog.getString('Fix All Data'), icon: 'fa fa-wrench', link: 'tools.fixAllData', description: gettextCatalog.getString('')},
            {title: gettextCatalog.getString('Fix Partner Status'), icon: 'fa fa-usd', link: 'tools.fixPartnerStatus', description: gettextCatalog.getString('')},
            {title: gettextCatalog.getString('Fix Email Address'), icon: 'fa fa-envelope-o', link: 'tools.fixEmailAddress', description: gettextCatalog.getString('')},
            {title: gettextCatalog.getString('Fix Mailing Address'), icon: 'fa fa-map', link: 'tools.fixMailingAddress', description: gettextCatalog.getString('')},
            {title: gettextCatalog.getString('Merge Contacts'), icon: 'fa fa-wrench', link: 'tools.mergeContacts', description: gettextCatalog.getString('')},
            {title: gettextCatalog.getString('Merge People'), icon: 'fa fa-user-secret', link: 'tools.mergePeople', description: gettextCatalog.getString('')}
        ];
    }
}

export default angular.module('mpdx.tools.service', [])
    .service('tools', ToolsService).name;
