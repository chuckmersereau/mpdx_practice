import reduce from 'lodash/fp/reduce';
import sum from 'lodash/fp/sum';
import values from 'lodash/fp/values';

class ToolsService {
    constructor(
        gettextCatalog,
        api
    ) {
        this.api = api;

        this.data = [
            {
                title: gettextCatalog.getString('Goals & Appeals'),
                icon: 'fa fa-trophy',
                link: 'tools.appeals',
                description: gettextCatalog.getString('Set goals, create asks, and track progress for one time needs'),
                enabled: false
            },
            {
                title: gettextCatalog.getString('Import from Google'),
                icon: 'fa fa-google',
                link: 'tools.import.google',
                description: gettextCatalog.getString('Import your contact information from your Google account'),
                enabled: true,
                imports: true
            },
            {
                title: gettextCatalog.getString('Import from CSV'),
                icon: 'fa fa-table',
                link: 'tools.import.csv',
                description: gettextCatalog.getString('Import contacts you have saved in a CSV file'),
                enabled: true,
                imports: true
            },
            {
                title: gettextCatalog.getString('Import from TntConnect'),
                icon: 'fa fa-cloud-upload',
                link: 'tools.import.tnt',
                description: gettextCatalog.getString('Import your contacts from your TntConnect database'),
                enabled: true,
                imports: true
            },
            {
                title: gettextCatalog.getString('Fix Commitment Info'),
                icon: 'fa fa-usd',
                link: 'tools.fix.commitmentInfo',
                description: gettextCatalog.getString('Set the correct contacts commitment info for each contact'),
                enabled: true,
                analyticKey: 'fix-commitment-info'
            },
            {
                title: gettextCatalog.getString('Fix Email Addresses'),
                icon: 'fa fa-envelope-o',
                link: 'tools.fix.emailAddresses',
                description: gettextCatalog.getString('Set the correct primary email address for each person'),
                enabled: true,
                analyticKey: 'fix-email-addresses'
            },
            {
                title: gettextCatalog.getString('Fix Mailing Addresses'),
                icon: 'fa fa-map',
                link: 'tools.fix.addresses',
                description: gettextCatalog.getString('Set the correct primary mailing address for each contact'),
                enabled: true,
                analyticKey: 'fix-addresses'
            },
            {
                title: gettextCatalog.getString('Fix Phone Numbers'),
                icon: 'fa fa-phone-square',
                link: 'tools.fix.phoneNumbers',
                description: gettextCatalog.getString('Set the correct primary phone number for each person'),
                enabled: true,
                analyticKey: 'fix-phone-numbers'
            },
            {
                title: gettextCatalog.getString('Fix Send Newsletter'),
                icon: 'fa fa-newspaper-o',
                link: 'tools.fix.sendNewsletter',
                description: gettextCatalog.getString('Set the correct newsletter state for each contact'),
                enabled: true,
                analyticKey: 'fix-send-newsletter'
            },
            {
                title: gettextCatalog.getString('Merge Contacts'),
                icon: 'fa fa-home',
                link: 'tools.merge.contacts',
                description: gettextCatalog.getString('Review and merge duplicate contacts'),
                enabled: true,
                analyticKey: 'duplicate-contacts'
            },
            {
                title: gettextCatalog.getString('Merge People'),
                icon: 'fa fa-users',
                link: 'tools.merge.people',
                description: gettextCatalog.getString('Review and merge duplicate people'),
                enabled: true,
                analyticKey: 'duplicate-people'
            }
        ];
        this.analytics = {};
    }

    getAnalytics(reset = false) {
        if (this.analytics && values(this.analytics).length > 1 && !reset) {
            return Promise.resolve(this.analytics);
        }
        return this.api.get(
            'tools/analytics', { filter: { account_list_id: this.api.account_list_id } }
        ).then((data) => {
            this.analytics = {};
            this.analytics = reduce((result, obj) => {
                result[obj.type] = obj.count;
                return result;
            }, {}, data.counts_by_type[0].counts);

            return this.analytics;
        });
    }

    getTotal() {
        return sum(values(this.analytics));
    }
}

import gettextCatalog from 'angular-gettext';
import api from 'common/api/api.service';

export default angular.module('mpdx.tools.service', [
    gettextCatalog,
    api
]).service('tools', ToolsService).name;
