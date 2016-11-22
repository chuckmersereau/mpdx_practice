import component from './donations.component';
import edit from './edit/edit.controller';
import service from './donations.service';

export default angular.module('mpdx.donations', [
    component,
    edit,
    service
]).name;