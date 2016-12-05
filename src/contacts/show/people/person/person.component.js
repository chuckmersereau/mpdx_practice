class ContactPersonController {
    constructor(
        $sce
    ) {
        this.$sce = $sce;

        this.person.selected_for_merge = false;
    }
    selectCard() {
        if (this.isMerging === true) {
            this.person.selected_for_merge = !this.person.selected_for_merge;
        } else {
            this.person.selected_for_merge = false;
        }
    }
    trustSrc(src) {
        return this.$sce.trustAsResourceUrl(src);
    }
}

const Person = {
    controller: ContactPersonController,
    template: require('./person.html'),
    bindings: {
        person: '<',
        isMerging: '='
    }
};

export default angular.module('mpdx.contacts.show.person.component', [])
    .component('contactPerson', Person).name;
