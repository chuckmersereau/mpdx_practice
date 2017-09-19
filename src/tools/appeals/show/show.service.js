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
        return this.api.get(`appeals/${appealId}/appeal_contacts`, {
            include: 'contact',
            per_page: 9000,
            fields: {
                contact: 'name,pledge_amount,pledge_currency,pledge_frequency'
            }
        });
    }
    getPledges(appealId) {
        return this.api.get(`account_lists/${this.api.account_list_id}/pledges`, {
            include: 'contact,donations',
            // fields: {
            //     contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
            // },
            filter: {
                appeal_id: appealId
            }
        }).then((data) => {
            this.$log.debug('pledges', data);
            return data;
        });
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.tools.appeals.show.service', [
    api
]).service('appealsShow', Show).name;