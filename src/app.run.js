import config from 'config';

/*@ngInject*/
export default function appRun($transitions, $q, $window) {
    $transitions.onBefore({ to: () => {
        return true;
    } }, () => {
        let deferred = $q.defer();
        if (!$window.sessionStorage.token) {
            let searchParams = new URLSearchParams($window.location.search);
            let token = searchParams.get('access_token');
            if (token) {
                deferred.resolve();
                $window.sessionStorage.token = token;
            } else {
                deferred.reject();
                $window.location.href = config.theKeyUrl;
            }
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    });
}
