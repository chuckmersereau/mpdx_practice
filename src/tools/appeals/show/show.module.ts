import addPledge from './addPledge/add.controller';
import component from './show.component';
import editPledge from './editPledge/edit.controller';
import progressbar from './progressbar/progressbar.component';

export default angular.module('mpdx.tools.appeals.show', [
    addPledge, component, editPledge, progressbar
]).name;