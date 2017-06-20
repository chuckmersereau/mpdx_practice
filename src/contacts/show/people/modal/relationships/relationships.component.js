import has from 'lodash/fp/has';
import map from 'lodash/fp/map';
import assign from 'lodash/fp/assign';

class ContactFamilyRelationshipController {
    constructor(
        api
    ) {
        this.api = api;
        this.deleted = false;
    }
    $onInit() {
        if (has('related_person', this.familyRelationship)) {
            this.familyRelationship.related_person.display_name = `${this.familyRelationship.related_person.first_name} ${this.familyRelationship.related_person.last_name}`;
        }
    }
    remove() {
        this.deleted = true;
        this.onRemove();
    }
    search(text) {
        return this.api.get(`contacts//people`, {
            fields: {
                people: 'first_name,last_name'
            },
            filter: {
                wildcard_search: text
            },
            per_page: 10000
        }).then(data => {
            return map(item => {
                return assign(item, {display_name: `${item.first_name} ${item.last_name}`});
            }, data);
        });
    }
    select(item) {
        this.familyRelationship.related_person = item;
    }
}

const Relationships = {
    controller: ContactFamilyRelationshipController,
    template: require('./relationships.html'),
    bindings: {
        contact: '<',
        familyRelationship: '=',
        person: '=',
        onRemove: '&'
    }
};

import api from 'common/api/api.service';

export default angular.module('mpdx.contacts.show.personModal.family.component', [
    api
]).component('contactFamilyRelationship', Relationships).name;
