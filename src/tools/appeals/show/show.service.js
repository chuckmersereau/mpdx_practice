import relationshipId from 'common/fp/relationshipId';

class Show {
    constructor(
        api
    ) {
        this.api = api;
    }
    getAppeal(appealId) {
        return this.api.get({ url: `appeals/${appealId}`,
            data: {
                include: 'donations',
                filter: {
                    account_list_id: this.api.account_list_id
                }
            },
            deSerializationOptions: relationshipId('contacts')
        });
    }
    getAppealContacts(appealId) {
        return this.api.get(`appeals/${appealId}`, {
            include: 'contacts',
            fields: {
                appeals: 'contacts',
                contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
            },
            filter: {
                account_list_id: this.api.account_list_id
            }
        });
    }
    getPledges() {
        return this.api.get(`account_lists/${this.api.account_list_id}/pledges`, {
            // include: 'contacts',
            // fields: {
            //     appeal_id: appealId,
            //     contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
            // },
            // filter: {
            //     appeal_id: appealId
            // }
        });
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.tools.appeals.show.service', [
    api
]).service('appealsShow', Show).name;