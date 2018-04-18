import addTags from './tags/add/add.controller';
import component from './filter.component';
import daterange from './daterange/daterange.component';
import tags from './tags/tags.component';

export default angular.module('mpdx.tasks.filter', [
    addTags,
    daterange,
    component,
    tags
]).name;
