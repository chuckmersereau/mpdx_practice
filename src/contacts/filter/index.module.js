import daterange from './daterange/daterange.component';
import filter from './filter.component';
import tags from './tags/tags.component';


export default angular.module('mpdx.contacts.filter', [
    daterange,
    filter,
    tags
]).name;