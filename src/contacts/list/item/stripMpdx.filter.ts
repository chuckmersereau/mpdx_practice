import { isString } from 'lodash/fp';

function stripMpdx() {
    return function(val) {
        if (!isString(val)) { return ''; }
        return val.replace('https://mpdx.org', '');
    };
}

export default angular.module('mpdx.contacts.list.item.stripMpdx', [])
    .filter('stripMpdx', stripMpdx).name;