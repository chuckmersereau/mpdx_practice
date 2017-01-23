import add from './add/add.controller';
import component from './tags.component';
import remove from './remove/remove.controller';
import service from './tags.service';

export default angular.module('mpdx.contacts.tags', [
    add,
    component,
    remove,
    service
]).name;