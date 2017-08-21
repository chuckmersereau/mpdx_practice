import component from './appeals.component';
import list from './list/index.module';
import show from './show/show.component';
import wizard from './wizard/wizard.component';

export default angular.module('mpdx.tools.appeals', [
    component,
    list,
    show,
    wizard
]).name;