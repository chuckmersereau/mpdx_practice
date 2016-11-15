import add from './add/add.controller';
import component from './referrals.component';
import service from './referrals.service';

export default angular.module('mpdx.contacts.show.referrals', [
    add,
    component,
    service
]).name;