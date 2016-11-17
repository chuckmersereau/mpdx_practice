const UnavailableMessage = {
    template: require('./unavailableMessage.html')
};

export default angular.module('mpdx.unavailable.message.component', [])
    .component('unavailableMessage', UnavailableMessage).name;