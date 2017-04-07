import component from './fixEmailAddress.component';
import service from './fixEmailAddress.service';
import item from './item/index.module';

export default angular.module('mpdx.tools.fixEmailAddress', [
    component,
    service,
    item
]).name;
