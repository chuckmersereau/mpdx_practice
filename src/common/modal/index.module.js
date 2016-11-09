import component from './modal.component';
import controller from './modal.controller';
import header from './header.component';
import modalBig from './modalBig.component';
import service from './modal.service';

export default angular.module('mpdx.common.modal', [
    component,
    controller,
    header,
    modalBig,
    service
]).name;