class PersonService {
    api;

    constructor(
        $filter, api
    ) {
        this.$filter = $filter;
        this.api = api;
    }
    filterResponseById(values, ids) {
        if (values && ids && values.length > 0 && ids.length > 0) {
            return this.$filter('filter')(values, value => ids.indexOf(value.id) > -1);
        }
        return [];
    }
    mergePeople(contactId, winner, people) {
        const obj = {contact_id: contactId, winner: winner, people_ids: people};
        return this.api.post('people/merge', obj).then((data) => {
            if (_.isFunction(data.success)) {
                data.success();
            }
            return data;
        });
    }
}
export default angular.module('mpdx.contacts.show.people.person.service', [])
    .service('contactPerson', PersonService).name;
