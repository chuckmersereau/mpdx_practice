import addresses from './addresses/addresses.module';
import commitmentInfo from './commitment/commitment.module';
import component from './fix.component';
import emailAddresses from './email/email.module';
import phoneNumbers from './phone/phone.module';
import sendNewsletter from './newsletter/newsletter.module';

export default angular.module('mpdx.tools.fix', [
    component,
    addresses,
    commitmentInfo,
    emailAddresses,
    phoneNumbers,
    sendNewsletter
]).name;
