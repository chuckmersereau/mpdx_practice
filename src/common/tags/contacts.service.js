class TagsService {
    constructor() {
        this.singularCtx = 'contact';
        this.pluralCtx = 'contacts';
    }
}

export default angular.module('mpdx.common.contacts.service', [])
    .service('contactsTagsService', TagsService).name;
