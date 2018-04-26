import appeals from './appeals/appeals.module';
import component from './tools.component';
import fix from './fix/fix.module';
import imports from './import/import.module';
import merge from './merge/merge.module';

export default angular.module('mpdx.tools', [
    appeals,
    component,
    fix,
    imports,
    merge
]).name;