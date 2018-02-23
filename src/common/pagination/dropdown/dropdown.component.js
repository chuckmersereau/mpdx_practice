import { get } from 'lodash/fp';

class DropdownController {
    constructor(
        users
    ) {
        this.users = users;

        this.values = ['10', '25', '50', '100', '250', '500'];
    }
    change(val) {
        this.saveIfExists(val.size);
        this.onChange(val);
    }
    saveIfExists(size) {
        return this.userOption
            ? this.saveOption(size)
            : undefined;
    }
    saveOption(size) {
        const key = `page_size_${this.userOption}`;
        const option = get(key, this.users.currentOptions);
        return option
            ? this.saveExisting(option, size)
            : this.users.createOption(key, size);
    }
    saveExisting(option, val) {
        option.value = val;
        return this.users.setOption(option);
    }
}

const Dropdown = {
    template: require('./dropdown.html'),
    controller: DropdownController,
    bindings: {
        selected: '<',
        userOption: '@',
        onChange: '&'
    }
};

import users from 'common/users/users.service';

export default angular.module('mpdx.common.pagination.dropdown.component', [
    users
]).component('paginationDropdown', Dropdown).name;