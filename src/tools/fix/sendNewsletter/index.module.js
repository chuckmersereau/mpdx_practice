import component from './sendNewsletter.component';
import service from './sendNewsletter.service';
import item from './item/index.module';

export default angular.module('mpdx.tools.fix.sendNewsletter', [
    component,
    service,
    item
]).name;
