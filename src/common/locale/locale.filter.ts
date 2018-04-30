import * as moment from 'moment';

function localeFilter(
    $filter: ng.IFilterService,
    locale: LocaleService
) {
    return (val) => $filter('date')(val, locale.dateTimeFormat);
}

function localeFilterWithTime(
    $filter: ng.IFilterService,
    locale: LocaleService
) {
    return (val) => $filter('date')(val, locale.dateTimeFormat + ' hh:mm a');
}

function localeFilterShort() {
    return (val) => moment(val).format('MMM D');
}

import locale, { LocaleService } from './locale.service';

export default angular.module('mpdx.common.locale.filter', [locale])
    .filter('localize', localeFilter)
    .filter('localizeWithTime', localeFilterWithTime)
    .filter('localizeShort', localeFilterShort)
    .name;