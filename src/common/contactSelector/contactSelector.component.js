class ContactSelectorController {
    returnFn;
    constructor(
        modal
    ) {
        this.modal = modal;
    }
    openContactSelect(name) {
        const onHide = (params) => {
            this.returnFn({$params: params});
        };
        this.modal.open({
            template: require('./modal/modal.html'),
            controller: 'contactSelectController',
            locals: {
                returnFn: onHide,
                selectedContact: name
            }
        });
    }
}

const ContactSelector = {
    template: require('./contactSelector.html'),
    controller: ContactSelectorController,
    bindings: {
        contactName: '<',
        returnFn: '&'
    }
};

export default angular.module('mpdx.common.contactSelector.component', [])
    .component('contactSelector', ContactSelector).name;