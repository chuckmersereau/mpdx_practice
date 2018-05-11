import * as moment from 'moment';
import locale, { LocaleService } from './locale.service';

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

export default angular.module('mpdx.common.locale.filter', [locale])
    .filter('localize', localeFilter)
    .filter('localizeWithTime', localeFilterWithTime)
    .filter('localizeShort', localeFilterShort)
    .name;