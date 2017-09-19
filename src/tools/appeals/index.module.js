
import component from './appeals.component';
import list from './list/index.module';
import show from './show/index.module';
import wizard from './wizard/wizard.component';

export default angular.module('mpdx.tools.appeals', [
    component,
    list,
    show,
    wizard
]).name;