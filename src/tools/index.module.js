import appeals from './appeals/index.module';
import component from './tools.component';
import service from './tools.service';
import fix from './fix/index.module';
import imports from './import/index.module';
import merge from './merge/index.module';

export default angular.module('mpdx.tools', [
    appeals,
    component,
    service,
    fix,
    imports,
    merge
]).name;