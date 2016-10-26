import config from 'config';

let redirect = '';
/*@ngInject*/
export default function appRun($transitions, $q, $window, $rootScope) {
    $rootScope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=QF8dGA3a35KR61drl0zgxxT9kxE";
    $transitions.onBefore({ to: (state) => {
        if (state.name === 'login' || state.name === 'theKey') {
            return false;
        } else {
            redirect = state.name;
        }
        return true;
    } }, () => {
        let deferred = $q.defer();
        if (!$window.sessionStorage.ticket) {
            deferred.reject();
            $window.location.href = config.theKeyUrl + '?redirect=' + redirect;
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    });
}