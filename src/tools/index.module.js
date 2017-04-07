import imports from './import/index.module';
import tools from './tools.component';
import service from './tools.service';
import validationToolsSidebar from './validationToolsSidebar/validationToolsSidebar.component';
import fixEmailAddress from './fixEmailAddress/index.module';
import fixPhone from './fixPhone/index.module';
import fixMailingAddress from './fixMailingAddress/index.module';
import importFromCsv from './importFromCsv/index.module';
import mergeContacts from './mergeContacts/index.module';
import mergePeople from './mergePeople/index.module';

export default angular.module('mpdx.tools', [
    imports,
    tools,
    service,
    validationToolsSidebar,
    fixEmailAddress,
    fixPhone,
    fixMailingAddress,
    importFromCsv,
    mergeContacts,
    mergePeople
]).name;
