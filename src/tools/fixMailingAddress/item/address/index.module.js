import component from './address.component';
import modal from './modal/modal.controller';
import confirm from './modal/confirm/confirm.controller';

export default angular.module('mpdx.tools.fixMailingAddress.item.address', [
    component,
    modal,
    confirm
]).name;
