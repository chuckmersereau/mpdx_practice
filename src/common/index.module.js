import accounts from './accounts/accounts.service';
import alerts from './alerts/index.module';
import api from './api/api.service';
import appeals from './appeals/index.module';
import authInterceptor from './authInterceptor/authInterceptor.provider';
import autoFocus from './autoFocus/autofocus.directive';
import bgImg from './bgImg/bgImg.directive';
import chosen from './chosen/chosen.directive';
import convertToNumber from './convertToNumber/convertToNumber.directive';
import currency from './currency/currency.service';
import currencySelect from './currencySelect/currencySelect.component';
import pagination from './pagination/pagination.component';
import designationAccounts from './designationAccounts/designationAccounts.service';
import faCheckbox from './faCheckbox/faCheckbox.component';
import help from './help/help.service';
import layoutSettings from './layoutSettings/layoutSettings.directive';
import links from './links/index.module';
import login from './login/index.module';
import modal from './modal/index.module';
import momentFilter from './moment/moment.filter';
import monthRange from './monthRange/monthRange.service';
import rawNumber from './rawNumber/rawNumber.directive';
import selectionStore from './selectionStore/selectionStore.service';
import serverConstants from './serverConstants/serverConstants.service';
import session from './session/session.service';
import state from './state/state.service';
import tags from './tags/index.module';
import urlParameter from './urlParameter/urlParameter.service';
import users from './users/users.service';

export default angular.module('mpdx.common', [
    accounts,
    alerts,
    appeals,
    api,
    authInterceptor,
    autoFocus,
    bgImg,
    chosen,
    convertToNumber,
    currency,
    currencySelect,
    pagination,
    designationAccounts,
    faCheckbox,
    help,
    layoutSettings,
    links,
    login,
    modal,
    momentFilter,
    monthRange,
    rawNumber,
    selectionStore,
    serverConstants,
    session,
    state,
    tags,
    urlParameter,
    users
]).name;
