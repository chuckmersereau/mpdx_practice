import imports from './import/index.module';
import tools from './tools.component';
import service from './tools.service';
import importFromCsv from './importFromCsv/index.module';

export default angular.module('mpdx.tools', [
    imports,
    tools,
    service,
    importFromCsv
]).name;
