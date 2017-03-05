import component from './donations.component';
import service from './donations.service';
import modal from './modal/modal.controller';

export default angular.module('mpdx.reports.donations', [
    component,
    modal,
    service
]).name;
