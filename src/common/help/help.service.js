/*global HS*/
class HelpService {
    showHelp() {
        HS.beacon.open();
    }

    updateUser(user) {
        if (angular.isUndefined(user)) { return; }
        HS.beacon.ready(() => {
            HS.beacon.identify({
                id: user.id,
                name: `${user.first_name} ${user.last_name}`
            });
        });
    }

    suggest(articleIds) {
        HS.beacon.ready(() => {
            HS.beacon.suggest(articleIds);
        });
    }
}

export default angular.module('mpdx.common.help', [])
    .service('help', HelpService).name;
