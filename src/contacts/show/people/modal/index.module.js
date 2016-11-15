import controller from './modal.controller';
import email from './email/email.component';
import family from './relationships/relationships.component';
import network from './network/network.component';
import phone from './phone/phone.component';

export default angular.module('mpdx.contacts.show.people.modal', [
    controller,
    email,
    family,
    network,
    phone
]).name;