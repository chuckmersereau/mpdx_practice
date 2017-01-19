class ContactPersonController {
    constructor(
        $sce
    ) {
        this.$sce = $sce;
    }
    selectCard() {
        if (!this.isMerging) return;
        this.onSelectPerson({person: this.person});
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
        isMerging: '<',
        onSelectPerson: '&'
    }
};

export default angular.module('mpdx.contacts.show.person.component', [])
    .component('contactPerson', Person).name;
