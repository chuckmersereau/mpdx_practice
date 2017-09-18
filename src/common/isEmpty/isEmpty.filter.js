import empty from 'lodash/fp/isEmpty';

function isEmptyFilter() {
    return (obj) => empty(obj);
}

export default angular.module('mpdx.common.isEmpty', [])
    .filter('isEmpty', isEmptyFilter).name;
