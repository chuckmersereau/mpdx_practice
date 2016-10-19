import referrals from './referrals/referrals.service';
import service from './contacts.service';

export default angular.module('mpdx.services.contacts', [
    referrals,
    service
]).name;