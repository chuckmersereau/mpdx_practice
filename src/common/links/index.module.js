import email from './email/email.component';
import facebook from './facebook/facebook.component';
import linkedin from './linkedin/linkedin.component';
import twitter from './twitter/twitter.component';
import website from './website/website.component';

export default angular.module('mpdx.common.links', [
    email,
    facebook,
    linkedin,
    twitter,
    website
]).name;