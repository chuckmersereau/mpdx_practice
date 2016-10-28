import cache from './cache/cache.service';
import component from './contacts.component';
import filter from './filter/index.module';
import list from './list/index.module';
import referrals from './referrals/referrals.service';
import service from './contacts.service';
import show from './show/index.module';

export default angular.module('mpdx.contacts', [
    cache,
    component,
    filter,
    list,
    referrals,
    service,
    show
]).name;