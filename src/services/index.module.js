import accounts from './accounts/accounts.service';
import alerts from './alerts/alerts.service';
import api from './api/api.service';
import authInterceptor from './authInterceptor/authInterceptor.provider';
import cache from './cache/cache.service';
import contacts from './contacts/index.module';
import currentAccountList from './currentAccountList/currentAccountList.service';
import currentUser from './currentUser/currentUser.service';
import filter from './filter/filter.service';
import flash from './flash/flash.service';
import modal from './modal/modal.service';
import preferences from './preferences/index.module';
import serverConstants from './serverConstants/serverConstants.service';
import session from './session/session.service';
import tags from './tags/tags.service';
import tasks from './tasks/tasks.service';

export default angular.module('mdpx.services', [
    accounts,
    alerts,
    api,
    authInterceptor,
    cache,
    contacts,
    currentAccountList,
    currentUser,
    filter,
    flash,
    modal,
    preferences,
    serverConstants,
    session,
    tags,
    tasks
]).name;