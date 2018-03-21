import add from './add/add.controller';
import component from './tags.component';
import service from './tags.service';

export default angular.module('mpdx.contacts.filter.tags', [
    add,
    component,
    service
]).name;