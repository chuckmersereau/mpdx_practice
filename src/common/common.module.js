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
import faCheckbox from './faCheckbox/faCheckbox.component';
import layoutSettings from './layoutSettings/layoutSettings.directive';
import links from './links/links.module';
import locale from './locale/locale.filter';
import login from './login/login.component';
import modal from './modal/modal.module';
import momentFilter from './moment/moment.filter';
import rawNumber from './rawNumber/rawNumber.directive';
import sourceToStr from './sourceToStr/sourceToStr.filter';
import pagination from './pagination/pagination.component';
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
    faCheckbox,
    layoutSettings,
    links,
    locale,
    login,
    modal,
    momentFilter,
    pagination,
    rawNumber,
    sourceToStr,
    tagSelector,
    threePartDatePicker,
    twoPartDateDisplay
]).name;
