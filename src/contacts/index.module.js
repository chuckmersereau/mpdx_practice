import cache from './cache/cache.service';
import component from './contacts.component';
import filter from './filter/index.module';
import list from './list/index.module';
import logTask from './logTask/logTask.controller';
import newContact from './new/new.controller';
import search from './search/search.component';
import service from './contacts.service';
import show from './show/index.module';
import tags from './tags/index.module';

export default angular.module('mpdx.contacts', [
    cache,
    component,
    filter,
    list,
    logTask,
    newContact,
    search,
    service,
    show,
    tags
]).name;
