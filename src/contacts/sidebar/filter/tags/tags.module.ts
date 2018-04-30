import add from './add/add.controller';
import component from './tags.component';
import remove from './remove/remove.controller';

export default angular.module('mpdx.contacts.tags', [
    add,
    component,
    remove
]).name;