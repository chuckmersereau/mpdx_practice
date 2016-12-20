function stripMpdx() {
    return function(val) {
        return val.replace('https://mpdx.org', '');
    };
}

export default angular.module('mpdx.contacts.list.item.stripMpdx', [])
    .filter('stripMpdx', stripMpdx).name;