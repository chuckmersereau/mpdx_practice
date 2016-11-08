import uiBs from 'angular-ui-bootstrap';

class TagsController {
    constructor(tasksTagsService) {
        this.tagsService = tasksTagsService;
    }
}

const Tags = {
    controller: TagsController,
    controllerAs: 'vm',
    template: require('./tags.html'),
    bindings: {}
};

export default angular.module('mpdx.tasks.tags.component', [])
    .component('tasksTags', Tags).name;
