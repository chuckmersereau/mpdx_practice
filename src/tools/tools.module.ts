import appeals from './appeals/appeals.module';
import component from './tools.component';
import fix from './fix/fix.module';
import imports from './import/import.module';
import merge from './merge/merge.module';
import sidebar from './sidebar/sidebar.component';

export default angular.module('mpdx.tools', [
    appeals,
    component,
    fix,
    imports,
    merge,
    sidebar
]).name;
