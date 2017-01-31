class ContactReconcileIndividualItemController {
    person;
}

const Item = {
    controller: ContactReconcileIndividualItemController,
    template: require('./item.html'),
    bindings: {
        person: '=',
        selected: '=',
        dontMerge: '='
    }
};

export default angular.module('mpdx.contacts.reconcileIndividual.item.component', [])
    .component('contactsReconcileIndividualItem', Item).name;
