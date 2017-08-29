import component from './fix.component';
import addresses from './addresses/index.module';
import commitmentInfo from './commitmentInfo/index.module';
import emailAddresses from './emailAddresses/index.module';
import phoneNumbers from './phoneNumbers/index.module';
import sendNewsletter from './sendNewsletter/index.module';
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
