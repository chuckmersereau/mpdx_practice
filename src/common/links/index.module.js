import email from './email/email.component';
import facebook from './facebook/facebook.component';
import twitter from './twitter/twitter.component';

export default angular.module('mpdx.common.links', [
    email,
    facebook,
    twitter
]).name;