import empty from 'lodash/fp/empty';

function isEmptyFilter() {
    return obj => empty(obj);
}

export default angular.module('mpdx.common.isEmpty', [])
  .filter('isEmpty', isEmptyFilter).name;
