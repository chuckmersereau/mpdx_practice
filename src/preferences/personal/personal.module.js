import component from './personal.component';
import homeCountry from './homeCountry/homeCountry.component';
import language from './language/language.component';
import locale from './locale/locale.component';
import timeZone from './timeZone/timeZone.component';

export default angular.module('mpdx.preferences.personal', [
    component,
    homeCountry,
    language,
    locale,
    timeZone
]).name;
