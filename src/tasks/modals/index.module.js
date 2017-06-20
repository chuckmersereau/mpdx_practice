import add from './add/add.controller';
import bulkEdit from './bulkEdit/bulkEdit.controller';
import complete from './complete/complete.controller';
import edit from './edit/edit.controller';
import log from './log/log.controller';
import newsletter from './newsletter/newsletter.controller';
import removeTags from './removeTags/removeTags.controller';
import service from './modals.service';

export default angular.module('mpdx.tasks.modals', [
    add,
    bulkEdit,
    complete,
    edit,
    log,
    newsletter,
    removeTags,
    service
]).name;
