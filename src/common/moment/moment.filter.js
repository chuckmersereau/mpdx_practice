import moment from 'moment';

function MomentFilter() {
    return function(dateString, format) {
        return moment(dateString).format(format);
    };
}

export default angular.module('mpdx.common.moment.filter', [])
    .filter('moment', MomentFilter).name;