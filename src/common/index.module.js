import accounts from './accounts/accounts.service';
import alerts from './alerts/index.module';
import anniversaries from './anniversaries/anniversaries.component';
import api from './api/api.service';
import appeals from './appeals/index.module';
import authInterceptor from './authInterceptor/authInterceptor.provider';
import autoFocus from './autoFocus/autofocus.directive';
import bgImg from './bgImg/bgImg.directive';
import birthdays from './birthdays/birthdays.component';
import chosen from './chosen/chosen.directive';
import convertToNumber from './convertToNumber/convertToNumber.directive';
import currency from './currency/currency.service';
import currencySelect from './currencySelect/currencySelect.component';
import currentAccountList from './currentAccountList/currentAccountList.service';
import currentUser from './currentUser/currentUser.service';
import designationAccounts from './designationAccounts/designationAccounts.service';
import faCheckbox from './faCheckbox/faCheckbox.component';
import flash from './flash/flash.service';
import help from './help/help.service';
import layoutSettings from './layoutSettings/layoutSettings.directive';
import links from './links/index.module';
import login from './login/index.module';
import modal from './modal/index.module';
import monthRange from './monthRange/monthRange.service';
import rawNumber from './rawNumber/rawNumber.directive';
import selectionStore from './selectionStore/selectionStore.service';
import serverConstants from './serverConstants/serverConstants.service';
import session from './session/session.service';
import state from './state/state.service';
import tags from './tags/index.module';
import pagination from './pagination/pagination.component';
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
    chosen,
    convertToNumber,
    currency,
    currencySelect,
    currentAccountList,
    currentUser,
    designationAccounts,
    faCheckbox,
    flash,
    help,
    layoutSettings,
    links,
    login,
    modal,
    monthRange,
    rawNumber,
    selectionStore,
    serverConstants,
    session,
    tags,
    pagination,
    state,
    urlParameter
]).name;
