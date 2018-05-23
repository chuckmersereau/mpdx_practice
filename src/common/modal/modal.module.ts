import component from './modal.component';
import confirm from './confirm/confirm.controller';
import info from './info/info.controller';

export default angular.module('mpdx.common.modal', [
    component,
    confirm,
    info
]).name;
