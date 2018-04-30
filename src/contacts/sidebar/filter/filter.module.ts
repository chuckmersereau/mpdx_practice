import daterange from './daterange/daterange.component';
import filter from './filter.component';
import tags from './tags/tags.module';

export default angular.module('mpdx.contacts.filter', [
    daterange,
    filter,
    tags
]).name;