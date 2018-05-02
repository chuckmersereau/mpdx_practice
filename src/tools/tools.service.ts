import { reduce, sum, values } from 'lodash/fp';

export class ToolsService {
    analytics: any;
    data: any[];
    constructor(
        private $q: ng.IQService,
        gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService
    ) {
        this.data = [
            {
                title: gettextCatalog.getString('Appeals'),
                icon: 'fas fa-trophy',
                link: 'tools.appeals',
                description: gettextCatalog.getString('Set goals, create asks, and track progress for one time needs'),
                enabled: true
            },
            {
                title: gettextCatalog.getString('Import from Google'),
                icon: 'fab fa-google',
                link: 'tools.import.google',
                description: gettextCatalog.getString('Import your contact information from your Google account'),
                enabled: true,
                imports: true
            },
            {
                title: gettextCatalog.getString('Import from CSV'),
                icon: 'fas fa-table',
                link: 'tools.import.csv',
                description: gettextCatalog.getString('Import contacts you have saved in a CSV file'),
                enabled: true,
                imports: true
            },
            {
                title: gettextCatalog.getString('Import from TntConnect'),
                icon: 'fas fa-cloud-upload',
                link: 'tools.import.tnt',
                description: gettextCatalog.getString('Import your contacts from your TntConnect database'),
                enabled: true,
                imports: true
            },
            {
                title: gettextCatalog.getString('Fix Commitment Info'),
                icon: 'fas fa-dollar-sign',
                link: 'tools.fix.commitmentInfo',
                description: gettextCatalog.getString('Set the correct contacts commitment info for each contact'),
                enabled: true,
                analyticKey: 'fix-commitment-info'
            },
            {
                title: gettextCatalog.getString('Fix Email Addresses'),
                icon: 'far fa-envelope',
                link: 'tools.fix.emailAddresses',
                description: gettextCatalog.getString('Set the correct primary email address for each person'),
                enabled: true,
                analyticKey: 'fix-email-addresses'
            },
            {
                title: gettextCatalog.getString('Fix Mailing Addresses'),
                icon: 'fas fa-map',
                link: 'tools.fix.addresses',
                description: gettextCatalog.getString('Set the correct primary mailing address for each contact'),
                enabled: true,
                analyticKey: 'fix-addresses'
            },
            {
                title: gettextCatalog.getString('Fix Phone Numbers'),
                icon: 'fas fa-phone-square',
                link: 'tools.fix.phoneNumbers',
                description: gettextCatalog.getString('Set the correct primary phone number for each person'),
                enabled: true,
                analyticKey: 'fix-phone-numbers'
            },
            {
                title: gettextCatalog.getString('Fix Send Newsletter'),
                icon: 'far fa-newspaper',
                link: 'tools.fix.sendNewsletter',
                description: gettextCatalog.getString('Set the correct newsletter state for each contact'),
                enabled: true,
                analyticKey: 'fix-send-newsletter'
            },
            {
                title: gettextCatalog.getString('Merge Contacts'),
                icon: 'fas fa-home',
                link: 'tools.merge.contacts',
                description: gettextCatalog.getString('Review and merge duplicate contacts'),
                enabled: true,
                analyticKey: 'duplicate-contacts'
            },
            {
                title: gettextCatalog.getString('Merge People'),
                icon: 'fas fa-users',
                link: 'tools.merge.people',
                description: gettextCatalog.getString('Review and merge duplicate people'),
                enabled: true,
                analyticKey: 'duplicate-people'
            }
        ];
        this.analytics = {};
    }
    getAnalytics(reset: boolean = false): ng.IPromise<any> {
        if (this.analytics && values(this.analytics).length > 1 && !reset) {
            return this.$q.resolve(this.analytics);
        }
        return this.api.get(
            'tools/analytics', { filter: { account_list_id: this.api.account_list_id } }
        ).then((data: any) => {
            this.analytics = {};
            this.analytics = reduce((result, obj) => {
                result[obj.type] = obj.count;
                return result;
            }, {}, data.counts_by_type[0].counts);

            return this.analytics;
        });
    }
    getTotal(): number {
        return sum(values(this.analytics));
    }
}

import 'angular-gettext';
import api, { ApiService } from '../common/api/api.service';

export default angular.module('mpdx.tools.service', [
    'gettext',
    api
]).service('tools', ToolsService).name;
