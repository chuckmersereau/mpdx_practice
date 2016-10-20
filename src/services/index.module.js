import accounts from './accounts/accounts.service';
import api from './api/api.service';
import authInterceptor from './authInterceptor/authInterceptor.provider';
import cache from './cache/cache.service';
import currentAccountList from './currentAccountList/currentAccountList.service';
import currentUser from './currentUser/currentUser.service';
import filter from './filter/filter.service';
import flash from './flash/flash.service';
import preferences from './preferences/index.module';
import serverConstants from './serverConstants/serverConstants.service';
import session from './session/session.service';
import tags from './tags/tags.service';

export default angular.module('mdpx.services', [
    accounts,
    api,
    authInterceptor,
    cache,
    currentAccountList,
    currentUser,
    filter,
    flash,
    preferences,
    serverConstants,
    session,
    tags
]).name;