class TagsController {
    hideTags: boolean;
    constructor(
        private tasksTags: TasksTagsService
    ) {
        this.hideTags = true;
    }
}

const Tags = {
    controller: TagsController,
    template: require('./tags.html')
};

import tasksTags, { TasksTagsService } from './tags.service';

export default angular.module('mpdx.tasks.tags', [
    tasksTags
]).component('tasksTags', Tags).name;
