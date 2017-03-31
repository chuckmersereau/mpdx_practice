import component from './modal.component';
import confirm from './confirm/confirm.controller';
import info from './info/info.controller';
import service from './modal.service';

export default angular.module('mpdx.common.modal', [
    component,
    confirm,
    info,
    service
]).name;
