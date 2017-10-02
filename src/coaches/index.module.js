import component from './coaches.component';
import list from './list/index.module';
import show from './show/index.module';

export default angular.module('mpdx.coaches', [
    component,
    list,
    show
]).name;
