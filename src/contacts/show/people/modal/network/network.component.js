class ContactNetworkController {
    constructor() {
        this.deleted = false;
    }
    remove() {
        this.network._destroy = 1;
        this.deleted = true;
        this.onRemove();
    }
}

const Network = {
    controller: ContactNetworkController,
    template: require('./network.html'),
    bindings: {
        network: '=',
        onRemove: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.network.component', [])
    .component('contactNetwork', Network).name;
