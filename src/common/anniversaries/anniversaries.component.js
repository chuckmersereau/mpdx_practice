class anniversariesController {
    constructor(currentAccountList) {
        this.currentAccountList = currentAccountList;

        this.anniversaries = [];
    }
    $onInit() {
        if (!this.currentAccountList.contacts_with_anniversaries) {
            this.currentAccountList.getContactsWithAniversaries();
        }
    }
    $onChanges(e) {
        if (e.currentAccountList) {
            this.anniversaries = this.currentAccountList.contacts_with_anniversaries;
        }
    }
}

const anniversariesComponent = {
    controller: anniversariesController,
    template: require('./anniversaries.html')
};


export default angular.module('mpdx.common.anniversaries', [])
    .component('anniversaries', anniversariesComponent).name;

