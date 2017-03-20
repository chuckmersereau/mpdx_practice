import imports from './import/index.module';
import tools from './tools.component';
import service from './tools.service';

export default angular.module('mpdx.tools', [
    imports,
    tools,
    service
]).name;
