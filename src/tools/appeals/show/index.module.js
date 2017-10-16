import addPledge from './addPledge/add.controller';
import component from './show.component';
import editPledge from './editPledge/edit.controller';
import service from './show.service';

export default angular.module('mpdx.tools.appeals.show', [
    addPledge, component, editPledge, service
]).name;