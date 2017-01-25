class ContactsFindDuplicatesController {
    api;
    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;

        this.duplicateContacts = [];
        this.duplicatePeople = [];
    }

    $onInit() {
        this.api.get('contacts/duplicates', {include: 'contacts'}).then((data) => {
            this.$log.debug('contacts/duplicates', data);
            // this.duplicateContacts = data;
        });

        this.api.get('contacts/people/duplicates', {include: 'people'}).then((data) => {
            this.$log.debug('contacts/people/duplicates', data);
            this.duplicatePeople = data;
        });
    }
}
const FindDuplicates = {
    controller: ContactsFindDuplicatesController,
    template: require('./findDuplicates.html'),
    bindings: {}
};

export default angular.module('mpdx.contacts.findDuplicates.component', [])
    .component('contactsFindDuplicates', FindDuplicates).name;
