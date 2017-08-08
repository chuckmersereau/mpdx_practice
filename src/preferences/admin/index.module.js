import component from './admin.component';
import impersonateUser from './impersonateUser/impersonateUser.component';
import offlineOrganization from './offlineOrganization/offlineOrganization.component';
import resetAccount from './resetAccount/resetAccount.component';

export default angular.module('mpdx.preferences.admin', [
    component,
    impersonateUser,
    offlineOrganization,
    resetAccount
]).name;
