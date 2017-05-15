import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import union from 'lodash/fp/union';

class RemoveTagController {
    selectedContacts;
    contacts;
    contactsTags;

    constructor(
        $rootScope, $scope,
        contactsTags,
        selectedContacts, currentListSize
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.selectedContacts = selectedContacts;
        this.contactsTags = contactsTags;
        this.currentListSize = currentListSize;

        this.tags = this.getTagsFromSelectedContacts();
    }
    removeTag(tag) {
        const contactIds = map('id', this.selectedContacts);
        return this.contactsTags.untagContact(contactIds, tag).then(() => {
            this.$rootScope.$emit('contactCreated');
            this.contactsTags.load();
            this.$scope.$hide();
        });
    }
    getTagsFromSelectedContacts() {
        // if more selected than data, use contactTags
        if (this.selectedContacts.length > this.currentListSize) {
            return map('name', this.contactsTags.data);
        }
        return reduce((result, contact) =>
                union(result, contact.tag_list)
            , [], this.selectedContacts).sort();
    }
}
import contacts from '../../../../contacts.service';
import contactsTags from '../tags.service';

export default angular.module('mpdx.contacts.sidebar.tags.remove.controller', [
    contacts, contactsTags
]).controller('removeTagController', RemoveTagController).name;
