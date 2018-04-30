import relationshipId from '../../../common/fp/relationshipId';

export class AppealsShowService {
    constructor(
        private $log: ng.ILogService,
        private api: ApiService
    ) {}
    getAppeal(appealId) {
        return this.api.get({
            url: `appeals/${appealId}`,
            data: {
                filter: {
                    account_list_id: this.api.account_list_id
                }
            },
            deSerializationOptions: relationshipId('contacts')
        });
    }
}

import api, { ApiService } from '../../../common/api/api.service';

export default angular.module('mpdx.tools.appeals.show.service', [
    api
]).service('appealsShow', AppealsShowService).name;