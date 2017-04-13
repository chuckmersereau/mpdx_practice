import component from './fix.component';
import addresses from './addresses/index.module';
import emailAddresses from './emailAddresses/index.module';
import phoneNumbers from './phoneNumbers/index.module';
import sidebar from './sidebar/sidebar.component';

export default angular.module('mpdx.tools.fix', [
    component,
    addresses,
    emailAddresses,
    phoneNumbers,
    sidebar
]).name;
