class ContactReconcilePartnerItemController {
    contact;
}

const Item = {
    controller: ContactReconcilePartnerItemController,
    template: require('./item.html'),
    bindings: {
        contact: '=',
        onClick: '&',
        selected: '=',
        dontMerge: '='
    }
};

export default angular.module('mpdx.contacts.reconcilePartner.item.component', [])
    .component('contactsReconcilePartnerItem', Item).name;
