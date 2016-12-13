class TagsController {
    constructor(tasksTagsService) {
        this.tagsService = tasksTagsService;
    }
}

const Tags = {
    controller: TagsController,
    template: require('./tags.html')
};

export default angular.module('mpdx.tasks.tags', [])
    .component('tasksTags', Tags).name;
