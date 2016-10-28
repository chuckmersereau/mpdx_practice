import accounts from './accounts/accounts.service';
import alerts from './alerts/index.module';
import anniversaries from './anniversaries/anniversaries.component';
import api from './api/api.service';
import authInterceptor from './authInterceptor/authInterceptor.provider';
import autoFocus from './autoFocus/autofocus.directive';
import bgImg from './bgImg/bgImg.directive';
import birthdays from './birthdays/birthdays.component';
import contacts from './contacts/index.module';
import convertToNumber from './convertToNumber/convertToNumber.directive';
import currencySelect from './currencySelect/currencySelect.component';
import currentAccountList from './currentAccountList/currentAccountList.service';
import currentUser from './currentUser/currentUser.service';
import donationSummaryChart from './donationsSummaryChart/donationsSummaryChart.directive';
import faCheckbox from './faCheckbox/faCheckbox.component';
import filter from './filter/filter.service';
import flash from './flash/flash.service';
import layoutSettings from './layoutSettings/layoutSettings.directive';
import links from './links/index.module';
import modal from './modal/modal.service';
import rawNumber from './rawNumber/rawNumber.directive';
import serverConstants from './serverConstants/serverConstants.service';
import session from './session/session.service';
import tags from './tags/tags.service';

export default angular.module('mpdx.common', [
    accounts,
    alerts,
    anniversaries,
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
    donationSummaryChart,
    faCheckbox,
    filter,
    flash,
    layoutSettings,
    links,
    modal,
    rawNumber,
    serverConstants,
    session,
    tags
]).name;