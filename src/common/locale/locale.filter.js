function localeFilter(
    $filter,
    locale
) {
    return val => $filter('date')(val, locale.dateTimeFormat);
}

function localeFilterWithTime(
    $filter,
    locale
) {
    return val => $filter('date')(val, locale.dateTimeFormat + ' hh:mm a');
}

import locale from './locale.service';

export default angular.module('mpdx.common.locale.filter', [locale])
    .filter('localize', localeFilter)
    .filter('localizeWithTime', localeFilterWithTime)
    .name;