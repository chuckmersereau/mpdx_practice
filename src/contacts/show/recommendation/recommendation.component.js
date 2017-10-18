const Recommendation = {
    template: require('./recommendation.html'),
    bindings: {
        recommendation: '<'
    }
};

export default angular.module('mpdx.contacts.show.recommendation.component', [
]).component('contactRecommendation', Recommendation).name;
