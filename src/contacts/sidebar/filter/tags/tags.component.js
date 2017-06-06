class TagsController {
    contactsTags;

    constructor(
        $rootScope,
        contactsTags
    ) {
        this.contactsTags = contactsTags;

        $rootScope.$on('accountListUpdated', () => {
            this.contactsTags.load();
        });
    }
}

const Tags = {
    controller: TagsController,
    template: require('./tags.html')
};

import contactsTags from './tags.service';

export default angular.module('mpdx.contacts.filter.tags.component', [
    contactsTags
]).component('contactsTags', Tags).name;
