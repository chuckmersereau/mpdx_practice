import map from 'lodash/fp/map';

class FixPhoneItemController {
    people;

    constructor(
        $log,
        people
    ) {
        this.$log = $log;
        this.people = people;
    }

    save() {
        _.each(this.person.phone_numbers, (phone) => {
            phone.valid_values = true;
        });

        return this.people.save(null, this.person).then(() => {
            this.person.hidden = true;
            this.service.meta.pagination.total_count--;
        });
    }

    changePrimary(id) {
        this.person.phone_numbers = map(val => {
            val.primary = val.id === id;
            return val;
        }, this.person.phone_numbers);
    }
}

const FixPhoneItem = {
    controller: FixPhoneItemController,
    template: require('./item.html'),
    bindings: {
        person: '=',
        service: '='
    }
};

export default angular.module('mpdx.tools.fixPhone.item.component', [])
    .component('fixPhoneItem', FixPhoneItem).name;