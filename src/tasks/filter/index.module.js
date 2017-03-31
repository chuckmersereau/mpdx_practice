import daterange from './daterange/daterange.component';
import component from './filter.component';
import service from './filter.service';
import tags from './tags/index.module';

export default angular.module('mpdx.tasks.filter', [
    daterange,
    component,
    service,
    tags
]).name;
