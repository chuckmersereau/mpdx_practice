import component from './accounts.component';
import invites from './invites/index.module';
import merge from './merge/index.module';
import share from './share/share.component';

export default angular.module('mpdx.preferences.accounts', [
    component,
    invites,
    merge,
    share
]).name;