import add from './add/add.controller';
import contactsService from './contacts.service';
import tasksService from './tasks.service';
import tagsDecorator from './tags.decorator';

export default angular.module('mpdx.common.tags', [
    add,
    contactsService,
    tasksService,
    tagsDecorator
]).name;
