import map from 'lodash/fp/map';

class FixEmailAddressItemController {
    people;

    constructor(
        $log,
        people
    ) {
        this.$log = $log;
        this.people = people;
    }

    save() {
        _.each(this.person.email_addresses, (email) => {
            email.valid_values = true;
        });

        return this.people.save(null, this.person).then(() => {
            this.person.hidden = true;
            this.service.meta.pagination.total_count--;
        });
    }

    changePrimary(id) {
        this.person.email_addresses = map(val => {
            val.primary = val.id === id;
            return val;
        }, this.person.email_addresses);
    }
}

const FixEmailAddressItem = {
    controller: FixEmailAddressItemController,
    template: require('./item.html'),
    bindings: {
        person: '=',
        service: '='
    }
};

export default angular.module('mpdx.tools.fixEmailAddress.item.component', [])
    .component('fixEmailAddressItem', FixEmailAddressItem).name;