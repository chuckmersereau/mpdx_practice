class TagsService {
    constructor() {
        this.singularCtx = 'contact';
        this.pluralCtx = 'contacts';
    }
}

export default angular.module('mpdx.tags.tasks.service', [])
    .service('tasksTagsService', TagsService).name;
