import { defaultTo, get, toInteger } from 'lodash/fp';
import * as moment from 'moment';

class BirthdaysController {
    birthdays_this_week: number;
    limit: number;
    watcher: any;
    watcher2: any;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private api: ApiService,
        private locale: LocaleService
    ) {
        this.limit = 5;
    }
    $onInit() {
        this.getBirthdaysThisWeek();

        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.getBirthdaysThisWeek();
        });
    }
    $onDestroy() {
        this.watcher();
    }
    partialDateSort(value) {
        let sortVal = defaultTo(0, get('birthday_month', value)) * 100;
        if (sortVal > 1100 && moment().month() === 11 && moment().date() > 20) { // reset for dec/jan sorting
            sortVal = 0;
        }
        sortVal += defaultTo(0, get('birthday_day', value));
        return toInteger(sortVal);
    }
    getBirthdaysThisWeek() {
        return this.api.get({
            url: 'contacts/analytics',
            data: {
                include: 'birthdays_this_week,'
                    + 'birthdays_this_week.facebook_accounts,'
                    + 'birthdays_this_week.twitter_accounts,'
                    + 'birthdays_this_week.email_addresses,'
                    + 'birthdays_this_week.parent_contact',
                fields: {
                    contact_analytics: 'birthdays_this_week',
                    people: 'birthday_day,birthday_month,birthday_year,facebook_accounts,first_name,last_name,'
                        + 'twitter_accounts,email_addresses,parent_contact',
                    email_addresses: 'email,primary',
                    facebook_accounts: 'username',
                    twitter_accounts: 'screen_name',
                    contact: ''
                },
                filter: { account_list_id: this.api.account_list_id }
            },
            overrideGetAsPost: true
        }).then((data: any) => {
            /* istanbul ignore next */
            this.$log.debug('contacts/analytics birthdays', data);
            this.birthdays_this_week = data.birthdays_this_week;
            return data.birthdays_this_week;
        });
    }
}

const Birthdays = {
    controller: BirthdaysController,
    template: require('./birthdays.html')
};

import api, { ApiService } from '../../../common/api/api.service';
import locale, { LocaleService } from '../../../common/locale/locale.service';

export default angular.module('mpdx.home.care.birthdays', [
    api, locale
]).component('birthdays', Birthdays).name;
