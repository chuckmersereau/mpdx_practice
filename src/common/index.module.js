import accounts from './accounts/accounts.service';
import alerts from './alerts/index.module';
import anniversaries from './anniversaries/anniversaries.component';
import api from './api/api.service';
import appeals from './appeals/index.module';
import authInterceptor from './authInterceptor/authInterceptor.provider';
import autoFocus from './autoFocus/autofocus.directive';
import bgImg from './bgImg/bgImg.directive';
import birthdays from './birthdays/birthdays.component';
import contacts from './contacts/index.module';
import convertToNumber from './convertToNumber/convertToNumber.directive';
import currencySelect from './currencySelect/currencySelect.component';
import currentAccountList from './currentAccountList/currentAccountList.service';
import currentUser from './currentUser/currentUser.service';
import designationAccounts from './designationAccounts/designationAccounts.service';
import donationSummaryChart from './donationsSummaryChart/donationsSummaryChart.directive';
import faCheckbox from './faCheckbox/faCheckbox.component';
import filter from './filter/filter.service';
import flash from './flash/flash.service';
import layoutSettings from './layoutSettings/layoutSettings.directive';
import links from './links/index.module';
import modal from './modal/index.module';
import monthRange from './monthRange/monthRange.service';
import rawNumber from './rawNumber/rawNumber.directive';
import selectionStore from './selectionStore/selectionStore.service';
import serverConstants from './serverConstants/serverConstants.service';
import session from './session/session.service';
import state from './state/state.service';
import tags from './tags/index.module';
import urlParameter from './urlParameter/urlParameter.service';

export default angular.module('mpdx.common', [
    accounts,
    alerts,
    anniversaries,
    appeals,
    api,
    authInterceptor,
    autoFocus,
    bgImg,
    birthdays,
    contacts,
    convertToNumber,
    currencySelect,
    currentAccountList,
    currentUser,
    designationAccounts,
    donationSummaryChart,
    faCheckbox,
    filter,
    flash,
    layoutSettings,
    links,
    modal,
    monthRange,
    rawNumber,
    selectionStore,
    serverConstants,
    session,
    state,
    tags,
    urlParameter
]).name;