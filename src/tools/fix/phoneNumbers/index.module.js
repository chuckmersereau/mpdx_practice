import component from './phoneNumbers.component';
import service from './phoneNumbers.service';
import item from './item/index.module';

export default angular.module('mpdx.tools.fix.phoneNumbers', [
    component,
    service,
    item
]).name;
