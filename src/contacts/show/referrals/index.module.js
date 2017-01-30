import add from './add/add.controller';
import component from './referrals.component';

export default angular.module('mpdx.contacts.show.referrals', [
    add,
    component
]).name;