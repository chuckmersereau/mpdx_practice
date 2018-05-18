import { headerComponent } from './header/header.component';
// import headerFilter from './header/filter/filter.component';
import save from './save/save.controller';
// import saved from './saved/saved.component';

export default angular.module('mpdx.common.filters.module', [
    headerComponent,
    // headerFilter,
    save
    // saved
]).name;
