import account from './account/account.component';
import component from './setup.component';
import connect from './connect/connect.component';
import finish from './finish/finish.component';
import preferences from './preferences/index.module';
import start from './start/start.component';

export default angular.module('mpdx.setup', [
    account,
    component,
    connect,
    preferences,
    finish,
    start
]).name;
