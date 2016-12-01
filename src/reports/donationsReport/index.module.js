import component from './donationsReport.component';
import edit from './edit/edit.controller';
import service from './DonationsReport.service';

export default angular.module('mpdx.reports.donations', [
    component,
    edit,
    service
]).name;
