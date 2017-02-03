import component from './setup.component';
import connect from './connect/connect.component';
import start from './start/start.component';

export default angular.module('mpdx.setup', [
    component,
    connect,
    start
]).name;