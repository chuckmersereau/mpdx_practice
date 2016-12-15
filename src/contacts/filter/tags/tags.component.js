class TagsController {
    contactsTags;

    constructor(contactsTags) {
        this.contactsTags = contactsTags;
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