class TagsController {
    tagsService;

    constructor(tagsService, gettextCatalog) {
        this.gettextCatalog = gettextCatalog;
        this.tagsService = tagsService;
    }
    stopPropagation(e) {
        e.stopPropagation();
    }
}

const Tags = {
    controller: TagsController,
    template: require('./tags.html')
};

export default angular.module('mpdx.contacts.filter.tags', [])
    .component('contactsTags', Tags).name;