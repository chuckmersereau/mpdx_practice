import add from './add/add.controller';
import service from './tasks.service';

export default angular.module('mpdx.tasks.service', [
    add,
    service
]).name;