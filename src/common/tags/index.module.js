import contactsService from './contacts.service';
import tasksService from './tasks.service';
import tagsDecorator from './tags.decorator';

export default angular.module('mpdx.common.tags', [
    contactsService,
    tasksService,
    tagsDecorator
]).name;