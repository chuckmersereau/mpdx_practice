import component from './accounts.component';
import invites from './invites/invites.component';
import merge from './merge/merge.component';
import share from './share/share.component';

export default angular.module('mpdx.preferences.accounts', [
    component,
    invites,
    merge,
    share
]).name;