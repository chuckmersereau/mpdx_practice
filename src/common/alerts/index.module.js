import directive from './alert/alert.directive';
import service from './alerts.service';

export default angular.module('mpdx.common.alerts', [
    directive,
    service
]).name;
