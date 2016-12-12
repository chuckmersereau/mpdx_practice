class TagsService {
    constructor() {
        this.singularCtx = 'task';
        this.pluralCtx = 'tasks';
    }
}

export default angular.module('mpdx.common.tags.tasks.service', [])
    .service('tasksTagsService', TagsService).name;
