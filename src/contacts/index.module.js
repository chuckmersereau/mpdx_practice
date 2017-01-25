import component from './contacts.component';
import filter from './filter/index.module';
import findDuplicates from './findDuplicates/findDuplicates.component';
import list from './list/index.module';
import logTask from './logTask/logTask.controller';
import newContact from './new/new.controller';
import search from './search/search.component';
import service from './contacts.service';
import show from './show/index.module';

export default angular.module('mpdx.contacts', [
    component,
    filter,
    findDuplicates,
    list,
    logTask,
    newContact,
    search,
    service,
    show
]).name;
