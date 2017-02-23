import controller from './modal.controller';
import email from './email/email.component';
import facebook from './facebook/facebook.component';
import family from './relationships/relationships.component';
import phone from './phone/phone.component';
import twitter from './twitter/twitter.component';
import website from './website/website.component';

export default angular.module('mpdx.contacts.show.people.modal', [
    controller,
    email,
    facebook,
    family,
    phone,
    twitter,
    website
]).name;