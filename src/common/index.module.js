import anniversaries from './anniversaries/anniversaries.component';
import birthdays from './birthdays/birthdays.component';
import contacts from './contacts/index.module';
import donationSummaryChart from './donationsSummaryChart/donationsSummaryChart.directive';
import emailLink from './emailLink/emailLink.component';
import facebookLink from './facebookLink/facebookLink.component';
import twitterLink from './twitterLink/twitterLink.component';

export default angular.module('mpdx.common', [
    anniversaries,
    birthdays,
    contacts,
    donationSummaryChart,
    emailLink,
    facebookLink,
    twitterLink
]).name;