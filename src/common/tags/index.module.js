import add from './add/add.controller';
import remove from './remove/remove.controller';
import service from './tags.service';

export default angular.module('mpdx.common.tags', [
    add,
    remove,
    service
]).name;