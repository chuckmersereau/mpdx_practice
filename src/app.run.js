import config from 'config';

let redirect = '';
export default function($transitions, $q, $window) {
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