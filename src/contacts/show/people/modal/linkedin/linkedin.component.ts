class LinkedinController {
    deleted: boolean;
    onRemove: any;
    constructor() {
        this.deleted = false;
    }
    remove() {
        this.deleted = true;
        this.onRemove();
    }
}

const Linkedin = {
    controller: LinkedinController,
    template: require('./linkedin.html'),
    bindings: {
        linkedinAccount: '=',
        onRemove: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.linkedin.component', [])
    .component('peopleLinkedin', Linkedin).name;
