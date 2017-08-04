import acceptInvite from './acceptInvite/acceptInvite.component';
import accounts from './accounts/accounts.service';
import alerts from './alerts/index.module';
import api from './api/api.service';
import appeals from './appeals/index.module';
import auth from './auth/auth.component';
import autofocus from './autofocus/autofocus.directive';
import avatar from './avatar/avatar.component';
import bgImg from './bgImg/bgImg.directive';
import chosen from './chosen/chosen.directive';
import collectionSelector from './collectionSelector/index.module';
import convertToNumber from './convertToNumber/convertToNumber.directive';
import cover from './cover/index.module';
import currencySelect from './currencySelect/currencySelect.component';
import datetimepicker from './datetimepicker/datetimepicker.component';
import designationAccounts from './designationAccounts/designationAccounts.service';
import donorAccounts from './donorAccounts/donorAccounts.service';
import faCheckbox from './faCheckbox/faCheckbox.component';
import filters from './filters/filters.service';
import help from './help/help.service';
import language from './language/language.service';
import layoutSettings from './layoutSettings/layoutSettings.directive';
import links from './links/index.module';
import locale from './locale/index.module';
import login from './login/login.component';
import modal from './modal/index.module';
import momentFilter from './moment/moment.filter';
import monthRange from './monthRange/monthRange.service';
import rawNumber from './rawNumber/rawNumber.directive';
import selectionStore from './selectionStore/selectionStore.service';
import serverConstants from './serverConstants/serverConstants.service';
import session from './session/session.service';
import sourceToStr from './sourceToStr/sourceToStr.filter';
import pagination from './pagination/pagination.component';
import tagSelector from './tagSelector/tagSelector.component';
import urlParameter from './urlParameter/urlParameter.service';
import users from './users/users.service';

export default angular.module('mpdx.common', [
    acceptInvite,
    accounts,
    alerts,
    appeals,
    api,
    auth,
    autofocus,
    avatar,
    bgImg,
    chosen,
    collectionSelector,
    convertToNumber,
    cover,
    currencySelect,
    datetimepicker,
    designationAccounts,
    donorAccounts,
    faCheckbox,
    filters,
    help,
    language,
    layoutSettings,
    links,
    locale,
    login,
    modal,
    momentFilter,
    monthRange,
    pagination,
    rawNumber,
    selectionStore,
    serverConstants,
    session,
    sourceToStr,
    tagSelector,
    urlParameter,
    users
]).name;
