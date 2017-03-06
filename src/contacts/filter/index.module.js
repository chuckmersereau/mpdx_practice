import daterange from './daterange/daterange.component';
import filter from './filter.component';
import mapContacts from './mapContacts/mapContacts.controller';
import service from './filter.service';
import tags from './tags/index.module';

export default angular.module('mpdx.contacts.filter', [
    daterange,
    filter,
    mapContacts,
    service,
    tags
]).name;