import { get } from 'lodash/fp';
import users, { UsersService } from '../../users/users.service';

class DropdownController {
    onChange: any;
    userOption: string;
    values: string[];
    constructor(
        private users: UsersService
    ) {
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

export default angular.module('mpdx.common.pagination.dropdown.component', [
    users
]).component('paginationDropdown', Dropdown).name;