import daterange from './daterange/daterange.component';
import filter from './filter.component';
import service from './filter.service';
import tags from './tags/tags.component';

export default angular.module('mpdx.contacts.filter', [
    daterange,
    filter,
    service,
    tags
]).name;