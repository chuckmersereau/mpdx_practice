import component from './emailAddresses.component';
import service from './emailAddresses.service';
import item from './item/index.module';

export default angular.module('mpdx.tools.fix.emailAddresses', [
    component,
    service,
    item
]).name;
