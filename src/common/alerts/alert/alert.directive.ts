const alert = {
    template: require('./alert.html')
};

export default angular.module('mpdx.common.alerts.alert.directive', [])
    .directive('alertTemplate', () => alert).name;