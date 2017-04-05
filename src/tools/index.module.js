import imports from './import/index.module';
import tools from './tools.component';
import service from './tools.service';
import importFromCsv from './importFromCsv/index.module';
import mergeContacts from './mergeContacts/index.module';
import mergePeople from './mergePeople/index.module';

export default angular.module('mpdx.tools', [
    imports,
    tools,
    service,
    importFromCsv,
    mergeContacts,
    mergePeople
]).name;
