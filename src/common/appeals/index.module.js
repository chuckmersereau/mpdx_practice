import service from './appeals.service';
import wizard from './wizard/wizard.controller';

export default angular.module('mpdx.common.appeals', [
    service,
    wizard
]).name;