class TagsController {
    constructor(tasksTags) {
        this.tasksTags = tasksTags;

        this.hideTags = true;
    }
}

const Tags = {
    controller: TagsController,
    template: require('./tags.html')
};

import tasksTags from './tags.service';

export default angular.module('mpdx.tasks.tags', [
    tasksTags
]).component('tasksTags', Tags).name;
