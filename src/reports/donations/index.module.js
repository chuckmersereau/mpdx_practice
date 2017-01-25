import component from './donations.component';
import service from './donations.service';
import edit from './edit/edit.controller';

export default angular.module('mpdx.reports.donations', [
    component,
    edit,
    service
]).name;
