class TagsController {
    contactsTags;

    constructor(
        contactsTags
    ) {
        this.contactsTags = contactsTags;
    }
}

const Tags = {
    controller: TagsController,
    template: require('./tags.html')
};

export default angular.module('mpdx.contacts.filter.tags.component', [])
    .component('contactsTags', Tags).name;
