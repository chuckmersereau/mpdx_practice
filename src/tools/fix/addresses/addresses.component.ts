import { find, map, reduce, reject, sortBy, unionBy } from 'lodash/fp';

class AddressesController {
    blockUI: IBlockUIService;
    data: any;
    loading: boolean;
    meta: any;
    page: number;
    source: string;
    sources: any[];
    watcher: any;
    constructor(
        private $filter: any,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        blockUI: IBlockUIService,
        private api: ApiService,
        private contacts: ContactsService,
        private modal: ModalService,
        private tools: ToolsService
    ) {
        this.$filter = $filter;
        this.$rootScope = $rootScope;
        this.api = api;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.tools = tools;

        this.blockUI = blockUI.instances.get('fix-addresses');
        this.source = 'MPDX';
        this.loading = false;
        this.page = 1;
    }
    $onInit() {
        this.loading = true;
        this.load();

        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }
    $onDestroy() {
        this.watcher();
    }
    load(reset = false, page = 1) {
        if (!reset && this.data && this.page === page) {
            return this.$q.resolve(this.data);
        }

        this.page = page;

        return this.api.get('contacts', {
            filter: {
                address_valid: false,
                account_list_id: this.api.account_list_id,
                deceased: false
            },
            fields: {
                contacts: 'name,avatar,addresses'
            },
            include: 'addresses',
            page: this.page,
            per_page: 25,
            sort: 'name'
        }).then((data: any) => {
            const initial = [{ id: 'MPDX', value: this.$filter('sourceToStr')('MPDX') }];
            const sources = unionBy('id', initial, reduce((result, contact) => {
                return unionBy('id', result, map((address) => ({
                    id: address.source,
                    value: this.$filter('sourceToStr')(address.source)
                }), contact.addresses));
            }, [], data));
            this.sources = sortBy('value', sources);
            this.data = data;
            this.setMeta(data.meta);
            this.loading = false;
            return this.data;
        });
    }
    setMeta(meta) {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count >= 0 && this.tools.analytics) {
            this.tools.analytics['fix-addresses'] = this.meta.pagination.total_count;
        }
    }
    save() {
        const message = this.gettextCatalog.getString(
            `You are updating all contacts visible on this page, setting the first {{source}} address as the primary address.
            If no such address exists the contact will not be updated. Are you sure you want to do this?`,
            { source: this.source }
        );
        return this.modal.confirm(message).then(() => {
            this.blockUI.start();
            return this.bulkSave(this.source).then(() => {
                this.blockUI.reset();
            });
        });
    }
    bulkSave(source) {
        let contacts = reduce((result, contact) => {
            let primaryAddress = find(['source', source], contact.addresses);
            if (primaryAddress) {
                contact.addresses = map((address) => {
                    address.primary_mailing_address = address.id === primaryAddress.id;
                    address.valid_values = true;
                    return address;
                }, contact.addresses);
                result.push(contact);
            }
            return result;
        }, [], this.data);

        return this.contacts.bulkSave(contacts).then(() => {
            return this.load(true);
        });
    }
    onSave(params) {
        const contact = params.contact;
        this.data = reject({ id: contact.id }, this.data);
        if (this.meta && this.meta.pagination && this.meta.pagination.total_count) {
            this.meta.pagination.total_count -= 1;
            this.setMeta(this.meta);
        }
        this.load(true, this.page);
    }
}

const Addresses = {
    controller: AddressesController,
    template: require('./addresses.html')
};

import 'angular-block-ui';
import 'angular-gettext';
import sourceToStr from '../../../common/sourceToStr/sourceToStr.filter';
import api, { ApiService } from '../../../common/api/api.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import modal, { ModalService } from '../../../common/modal/modal.service';
import tools, { ToolsService } from '../../tools.service';

export default angular.module('mpdx.tools.fix.addresses.component', [
    'gettext', 'blockUI',
    api, contacts, modal, sourceToStr, tools
]).component('fixAddresses', Addresses).name;
