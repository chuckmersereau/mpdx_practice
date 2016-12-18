class ContactInfoController {
    contact;
    contacts;

    constructor(
        contacts
    ) {
        this.contacts = contacts;
    }
    $onChange(obj) {
        if (obj.contact) {
            if (parseInt(obj.contact.currentValue.pledge_frequency) > 0) {
                this.contact.pledge_frequency = obj.contact.currentValue.pledge_frequency + '.0';
            }
        }
    }
    save() {
        this.contacts.save(this.contact);
    }
}
const Info = {
    controller: ContactInfoController,
    template: require('./info.html'),
    bindings: {
        contact: '=',
        constants: '='
    }
};

export default angular.module('mpdx.contacts.show.info.component', [])
    .component('contactInfo', Info).name;
