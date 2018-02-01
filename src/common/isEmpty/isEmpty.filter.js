import { isEmpty } from 'lodash/fp';

function isEmptyFilter() {
    return (obj) => isEmpty(obj);
}

export default angular.module('mpdx.common.isEmpty', [])
    .filter('isEmpty', isEmptyFilter).name;
