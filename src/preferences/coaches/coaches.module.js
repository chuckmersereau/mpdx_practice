import component from './coaches.component';
import invites from './invites/invites.component';
import share from './share/share.component';

export default angular.module('mpdx.preferences.coaches', [
    component,
    invites,
    share
]).name;
