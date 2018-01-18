import anniversaries from './anniversaries/anniversaries.component';
import birthdays from './birthdays/birthdays.component';
import exportContacts from './newsletters/export/export.controller';
import newsletters from './newsletters/newsletters.component';
import component from './care.component';

export default angular.module('mpdx.home.care', [
    anniversaries,
    birthdays,
    exportContacts,
    newsletters,
    component
]).name;
