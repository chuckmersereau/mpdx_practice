import currentAccountList from './currentAccountList/currentAccountList.service';
import currentUser from './currentUser/currentUser.service';

export default angular.module('mpdx.common', [
    currentAccountList,
    currentUser
]).name;