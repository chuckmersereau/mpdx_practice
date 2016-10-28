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
        if ($window.sessionStorage.token) {
            return $q.resolve();
        }
        $window.location.href = config.theKeyUrl;
        return $q.reject();
    });
}