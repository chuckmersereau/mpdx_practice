import component from './donationsReport.component';
import service from './donationsReport.service';
import edit from './edit/edit.controller';

export default angular.module('mpdx.reports.donations', [
    component,
    edit,
    service
]).name;
