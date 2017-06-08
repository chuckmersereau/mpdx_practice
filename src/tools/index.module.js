import imports from './import/index.module';
import tools from './tools.component';
import service from './tools.service';
import fix from './fix/index.module';
import mergeContacts from './mergeContacts/index.module';
import mergePeople from './mergePeople/index.module';

export default angular.module('mpdx.tools', [
    imports,
    tools,
    service,
    fix,
    mergeContacts,
    mergePeople
]).name;
