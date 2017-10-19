import addCommitment from './addCommitment/add.controller';
import component from './show.component';
import editCommitment from './editCommitment/edit.controller';
import service from './show.service';

export default angular.module('mpdx.tools.appeals.show', [
    addCommitment, component, editCommitment, service
]).name;