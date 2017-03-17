import component from './modal.component';
import confirm from './confirm/confirm.controller';
import service from './modal.service';

export default angular.module('mpdx.common.modal', [
    component,
    confirm,
    service
]).name;
