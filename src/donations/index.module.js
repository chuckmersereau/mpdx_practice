import component from './donations.component';
import edit from './edit/edit.controller';

export default angular.module('mpdx.donations', [
    component,
    edit
]).name;