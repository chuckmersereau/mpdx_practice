import component from './tasks.component';
import service from './tasks.service';
import filter from './filter/index.module';
import list from './list/index.module';
import modals from './modals/index.module';
import search from './search/search.component';

export default angular.module('mpdx.tasks', [
    component,
    service,
    filter,
    list,
    modals,
    search
]).name;
