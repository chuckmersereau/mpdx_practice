import acceptInvite from './acceptInvite/acceptInvite.component';
import alert from './alerts/alert/alert.directive';
import auth from './auth/auth.component';
import autofocus from './autofocus/autofocus.directive';
import avatar from './avatar/avatar.component';
import bgImg from './bgImg/bgImg.directive';
import chosen from './chosen/chosen.directive';
import collectionSelector from './collectionSelector/collectionSelector.component';
import contactsSelector from './contactsSelector/selector.component';
import cover from './cover/cover.component';
import datetimepicker from './datetimepicker/datetimepicker.component';
import designationAccountsSelector from './designationAccounts/selector/selector.component';
import drawer from './sideDrawer/drawer.component';
import faCheckbox from './faCheckbox/faCheckbox.component';
import filters from './filters/filters.module';
import links from './links/links.module';
import locale from './locale/locale.filter';
import login from './login/login.component';
import modal from './modal/modal.module';
import momentFilter from './moment/moment.filter';
import pagination from './pagination/pagination.component';
import paginationDropdown from './pagination/dropdown/dropdown.component';
import rawNumber from './rawNumber/rawNumber.directive';
import sortHeaderCaret from './sortHeaderCaret/caret.component';
import sourceToStr from './sourceToStr/sourceToStr.filter';
import tagSelector from './tagSelector/tagSelector.component';
import threePartDatePicker from './threePartDatePicker/picker.component';
import twoPartDateDisplay from './twoPartDateDisplay/display.component';

export default angular.module('mpdx.common', [
    acceptInvite,
    alert,
    auth,
    autofocus,
    avatar,
    bgImg,
    chosen,
    collectionSelector,
    contactsSelector,
    cover,
    datetimepicker,
    designationAccountsSelector,
    drawer,
    faCheckbox,
    filters,
    links,
    locale,
    login,
    modal,
    momentFilter,
    pagination,
    paginationDropdown,
    rawNumber,
    sortHeaderCaret,
    sourceToStr,
    tagSelector,
    threePartDatePicker,
    twoPartDateDisplay
]).name;
