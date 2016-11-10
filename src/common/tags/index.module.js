import add from './add/add.controller';
import contactsService from './contacts.service';
import tasksService from './tasks.service';
import tagsDecorator from './tags.decorator';
import remove from './remove/remove.controller';

export default angular.module('mpdx.common.tags', [
    add,
    remove,
    contactsService,
    tasksService,
    tagsDecorator
]).name;