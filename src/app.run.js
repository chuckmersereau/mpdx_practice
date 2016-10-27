import config from 'config';

/*@ngInject*/
export default function appRun($transitions, $q, $window, $rootScope) {
    $rootScope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=QF8dGA3a35KR61drl0zgxxT9kxE";
    $transitions.onBefore({ to: (state) => {
        if (state.name === 'login') {
            return false;
        } else if (!$window.sessionStorage.token) {
            $window.sessionStorage.redirect = state.name;
        }
        return true;
    } }, () => {
        let deferred = $q.defer();
        if (!$window.sessionStorage.token) {
            deferred.reject();
            $window.location.href = config.theKeyUrl;
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    });
}