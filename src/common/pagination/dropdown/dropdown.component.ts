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
        this.users.saveOption(key, size);
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