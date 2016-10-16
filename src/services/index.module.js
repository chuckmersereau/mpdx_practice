import api from './api/api.service';
import authInterceptor from './authInterceptor/authInterceptor.provider';
import currentAccountList from './currentAccountList/currentAccountList.service';
import currentUser from './currentUser/currentUser.service';
import session from './session/session.service';
import tasks from './tasks/tasks.service';

export default angular.module('mdpx.services', [
    api,
    authInterceptor,
    currentAccountList,
    currentUser,
    session,
    tasks
]).name;