import add from './add/add.controller';
import service from './tags.service';

export default angular.module('mpdx.common.tags', [
    add,
    service
]).name;