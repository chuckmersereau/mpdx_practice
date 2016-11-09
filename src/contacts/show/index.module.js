import completeTask from './completeTask/completeTask.controller';
import component from './show.component';
import personModal from './personModal/personModal.controller';

export default angular.module('mpdx.contacts.show', [
    completeTask,
    component,
    personModal
]).name;