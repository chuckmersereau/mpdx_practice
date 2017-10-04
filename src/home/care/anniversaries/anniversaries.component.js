import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';
import moment from 'moment';

class AnniversariesController {
    constructor(
        $log, $rootScope,
        api, locale
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;
        this.locale = locale;

        this.limit = 5;
    }
    $onInit() {
        this.getAnniversariesThisWeek();

        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.getAnniversariesThisWeek();
        });
    }
    $onDestroy() {
        this.watcher();
    }
    getAnniversariesThisWeek() {
        return this.api.get({
            url: 'contacts/analytics',
            data: {
                include: 'anniversaries_this_week,'
                + 'anniversaries_this_week.people,'
                + 'anniversaries_this_week.people.facebook_accounts,'
                + 'anniversaries_this_week.people.twitter_accounts,'
                + 'anniversaries_this_week.people.email_addresses,',
                fields: {
                    contact_analytics: 'anniversaries_this_week',
                    contacts: 'people',
                    people: 'anniversary_day,anniversary_month,anniversary_year,facebook_accounts,first_name,last_name,twitter_accounts,email_addresses,parent_contact',
                    email_addresses: 'email,primary',
                    facebook_accounts: 'username',
                    twitter_accounts: 'screen_name'
                },
                filter: { account_list_id: this.api.account_list_id }
            },
            overrideGetAsPost: true
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('contacts/analytics anniversaries', data);
            this.anniversaries_this_week = data.anniversaries_this_week;
            return data.anniversaries_this_week;
        });
    }
    partialDateSort(value) {
        let sortVal = defaultTo(0, get('people[0].anniversary_month', value)) * 100;
        if (sortVal > 1100 && moment().month() === 11 && moment().date() > 20) { // reset for dec/jan sorting
            sortVal = 0;
        }
        sortVal += defaultTo(0, get('people[0].anniversary_day', value));
        return parseInt(sortVal);
    }
}

const Anniversaries = {
    controller: AnniversariesController,
    template: require('./anniversaries.html')
};

import api from 'common/api/api.service';
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.home.care.anniversaries', [
    api, locale
]).component('anniversaries', Anniversaries).name;
