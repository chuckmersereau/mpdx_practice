import accounts from './accounts/accounts.service';
import alerts from './alerts/index.module';
import anniversaries from './anniversaries/anniversaries.component';
import api from './api/api.service';
import authInterceptor from './authInterceptor/authInterceptor.provider';
import birthdays from './birthdays/birthdays.component';
import contacts from './contacts/index.module';
import currentAccountList from './currentAccountList/currentAccountList.service';
import currentUser from './currentUser/currentUser.service';
import designationAccounts from './designationAccounts/designationAccounts.service';
import donationSummaryChart from './donationsSummaryChart/donationsSummaryChart.directive';
import filter from './filter/filter.service';
import flash from './flash/flash.service';
import links from './links/index.module';
import modal from './modal/modal.service';
import serverConstants from './serverConstants/serverConstants.service';
import session from './session/session.service';
import state from './state/state.service';
import tags from './tags/tags.service';

export default angular.module('mpdx.common', [
    accounts,
    alerts,
    anniversaries,
    api,
    authInterceptor,
    birthdays,
    contacts,
    currentAccountList,
    currentUser,
    designationAccounts,
    donationSummaryChart,
    filter,
    flash,
    links,
    modal,
    serverConstants,
    session,
    state,
    tags
]).name;