import api from './api/api.service';
import authInterceptor from './authInterceptor/authInterceptor.provider';
import contacts from './contacts/contacts.service';
import currentAccountList from './currentAccountList/currentAccountList.service';
import currentUser from './currentUser/currentUser.service';
import filter from './filter/filter.service';
import flash from './flash/flash.service';
import session from './session/session.service';
import tasks from './tasks/tasks.service';

export default angular.module('mdpx.services', [
    api,
    authInterceptor,
    contacts,
    currentAccountList,
    currentUser,
    filter,
    flash,
    session,
    tasks
]).name;