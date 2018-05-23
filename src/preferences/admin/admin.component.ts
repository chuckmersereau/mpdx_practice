class AdminController {
    tabId: string;
    constructor() {
        this.tabId = 'impersonate_user';
    }
    setTab(service) {
        if (this.tabId === service) {
            this.tabId = '';
        } else {
            this.tabId = service;
        }
    }
}

const Admin = {
    template: require('./admin.html'),
    controller: AdminController
};

export default angular.module('mpdx.preferences.admin.component', [])
    .component('preferencesAdmin', Admin).name;
