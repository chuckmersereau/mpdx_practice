import addresses from './addresses/addresses.component';
import addressModal from './addresses/address/modal/modal.controller';
import component from './show.component';
import details from './details/details.component';
import donorAccount from './details/donor/donor.component';
import info from './info/info.component';
import infoPerson from './info/person/person.component';
import notes from './notes/notes.component';
import people from './people/people.module';
import recommendation from './recommendation/recommendation.component';
import referrals from './referrals/referrals.component';
import addReferrals from './referrals/add/add.controller';
import tasks from './tasks/tasks.component';

export default angular.module('mpdx.contacts.show', [
    addReferrals,
    addresses,
    addressModal,
    component,
    details,
    donorAccount,
    info,
    infoPerson,
    notes,
    people,
    recommendation,
    referrals,
    tasks
]).name;
