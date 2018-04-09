import acceptInvite from './acceptInvite/acceptInvite.component';
import accounts from './accounts/accounts.service';
import alerts from './alerts/index.module';
import api from './api/api.service';
import auth from './auth/auth.component';
import autofocus from './autofocus/autofocus.directive';
import avatar from './avatar/avatar.component';
import bgImg from './bgImg/bgImg.directive';
import chosen from './chosen/chosen.directive';
import collectionSelector from './collectionSelector/index.module';
import contactsSelector from './contactsSelector/selector.component';
import cover from './cover/cover.component';
import datetimepicker from './datetimepicker/datetimepicker.component';
import designationAccounts from './designationAccounts/designationAccounts.service';
import designationAccountsSelector from './designationAccounts/selector/selector.component';
import donorAccounts from './donorAccounts/donorAccounts.service';
import drawer from './sideDrawer/drawer.component';
import faCheckbox from './faCheckbox/faCheckbox.component';
import filters from './filters/index.module';
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
import sortHeaderCaret from './sortHeaderCaret/caret.component';
import sourceToStr from './sourceToStr/sourceToStr.filter';
import pagination from './pagination/pagination.component';
import paginationDropdown from './pagination/dropdown/dropdown.component';
import tagSelector from './tagSelector/tagSelector.component';
import threePartDatePicker from './threePartDatePicker/picker.component';
import timeZone from './timeZone/timeZone.service';
import twoPartDateDisplay from './twoPartDateDisplay/display.component';
import urlParameter from './urlParameter/urlParameter.service';
import users from './users/users.service';

export default angular.module('mpdx.common', [
    acceptInvite,
    accounts,
    alerts,
    api,
    auth,
    autofocus,
    avatar,
    bgImg,
    chosen,
    collectionSelector,
    contactsSelector,
    cover,
    datetimepicker,
    designationAccounts,
    designationAccountsSelector,
    donorAccounts,
    drawer,
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
    paginationDropdown,
    rawNumber,
    selectionStore,
    serverConstants,
    session,
    sortHeaderCaret,
    sourceToStr,
    tagSelector,
    threePartDatePicker,
    timeZone,
    twoPartDateDisplay,
    urlParameter,
    users
]).name;
