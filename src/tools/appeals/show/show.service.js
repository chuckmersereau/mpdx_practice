import relationshipId from 'common/fp/relationshipId';

class Show {
    constructor(
        $log,
        api
    ) {
        this.$log = $log;
        this.api = api;
    }
    getAppeal(appealId) {
        return this.api.get({
            url: `appeals/${appealId}`,
            data: {
                include: 'donations',
                filter: {
                    account_list_id: this.api.account_list_id
                }
            },
            deSerializationOptions: relationshipId('contacts')
        });
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.tools.appeals.show.service', [
    api
]).service('appealsShow', Show).name;