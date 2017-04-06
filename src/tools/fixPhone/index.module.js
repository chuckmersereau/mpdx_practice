import component from './fixPhone.component';
import service from './fixPhone.service';
import item from './item/index.module';

export default angular.module('mpdx.tools.fixPhone', [
    component,
    service,
    item
]).name;
