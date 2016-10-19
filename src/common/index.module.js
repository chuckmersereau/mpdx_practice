import alerts from './alerts/index.module';
import anniversaries from './anniversaries/anniversaries.component';
import birthdays from './birthdays/birthdays.component';
import contacts from './contacts/index.module';
import donationSummaryChart from './donationsSummaryChart/donationsSummaryChart.directive';
import emailLink from './emailLink/emailLink.component';
import facebookLink from './facebookLink/facebookLink.component';
import modal from './modal/modal.service';
import twitterLink from './twitterLink/twitterLink.component';

export default angular.module('mpdx.common', [
    alerts,
    anniversaries,
    birthdays,
    contacts,
    donationSummaryChart,
    emailLink,
    facebookLink,
    modal,
    twitterLink
]).name;