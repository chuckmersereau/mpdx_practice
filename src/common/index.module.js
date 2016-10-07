import api from './api/api.service';
import currentAccountList from './currentAccountList/currentAccountList.service';
import currentUser from './currentUser/currentUser.service';
import tasks from './tasks/tasks.service';

export default angular.module('mpdx.common', [
    api,
    currentAccountList,
    currentUser,
    tasks
]).name;