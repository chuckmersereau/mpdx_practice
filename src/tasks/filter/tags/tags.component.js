class TagsController {
    constructor(tasksTags) {
        this.tagsService = tasksTags;
    }
}

const Tags = {
    controller: TagsController,
    template: require('./tags.html')
};

export default angular.module('mpdx.tasks.tags', [])
    .component('tasksTags', Tags).name;
