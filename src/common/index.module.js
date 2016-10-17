import anniversaries from './anniversaries/anniversaries.component';
import birthdays from './birthdays/birthdays.component';
import emailLink from './emailLink/emailLink.component';
import facebookLink from './facebookLink/facebookLink.component';
import twitterLink from './twitterLink/twitterLink.component';

export default angular.module('mpdx.common', [
    anniversaries,
    birthdays,
    emailLink,
    facebookLink,
    twitterLink
]).name;