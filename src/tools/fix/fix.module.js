import component from './fix.component';
import addresses from './addresses/addresses.module';
import commitmentInfo from './commitment/commitment.module';
import emailAddresses from './email/email.module';
import phoneNumbers from './phone/phone.module';
import sendNewsletter from './newsletter/newsletter.module';
import sidebar from './sidebar/sidebar.component';

export default angular.module('mpdx.tools.fix', [
    component,
    addresses,
    commitmentInfo,
    emailAddresses,
    phoneNumbers,
    sendNewsletter,
    sidebar
]).name;
