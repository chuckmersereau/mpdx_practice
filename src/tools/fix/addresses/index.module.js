import component from './addresses.component';
import service from './addresses.service';
import item from './item/index.module';

export default angular.module('mpdx.tools.fix.addresses', [
    component,
    service,
    item
]).name;
