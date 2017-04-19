import component from './commitmentInfo.component';
import service from './commitmentInfo.service';
import item from './item/index.module';

export default angular.module('mpdx.tools.fix.commitmentInfo', [
    component,
    service,
    item
]).name;
