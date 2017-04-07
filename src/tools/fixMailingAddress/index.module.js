import component from './fixMailingAddress.component';
import service from './fixMailingAddress.service';
import item from './item/index.module';

export default angular.module('mpdx.tools.fixMailingAddress', [
    component,
    service,
    item
]).name;
