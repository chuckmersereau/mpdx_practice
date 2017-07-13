const each = require('lodash/fp/each').convert({ 'cap': false });
import createPatch from 'common/fp/createPatch';
import difference from 'lodash/fp/difference';
import flatten from 'lodash/fp/flatten';
import has from 'lodash/fp/has';
import includes from 'lodash/fp/includes';
import invert from 'lodash/fp/invert';
import isNil from 'lodash/fp/isNil';
import joinComma from 'common/fp/joinComma';
import keys from 'lodash/fp/keys';
import omitBy from 'lodash/fp/omitBy';
import reduceObject from 'common/fp/reduceObject';
import union from 'lodash/fp/union';
import values from 'lodash/fp/values';

class CsvService {
    alerts;
    api;
    serverConstants;

    constructor(
        $log,
        $state, blockUI, gettextCatalog, Upload,
        alerts, api, help, serverConstants
    ) {
        this.$log = $log;
        this.$state = $state;
        this.blockUI = blockUI.instances.get('tools-import-csv');
        this.gettextCatalog = gettextCatalog;
        this.Upload = Upload;

        this.alerts = alerts;
        this.api = api;
        this.help = help;
        this.serverConstants = serverConstants;
    }

    $onInit() {
        this.reset();
    }

    reset() {
        this.data = null;
        this.dataInitialState = null;
        this.values_to_constants_mapping = {};
    }

    upload(file) {
        this.blockUI.start();
        return this.Upload.upload({
            url: `${this.api.apiUrl}account_lists/${this.api.account_list_id}/imports/csv`,
            data: {
                data: {
                    type: 'imports',
                    attributes: { file: file }
                }
            }
        }).then((resp) => {
            this.blockUI.reset();
            if (resp.data.data.id) {
                this.next(resp.data.data.id);
            }
        }).catch((error) => {
            this.blockUI.reset();
            /* istanbul ignore next */
            this.$log.error(error);
            this.alerts.addAlert(this.gettextCatalog.getString('Invalid CSV file - See help docs or send us a message with your CSV attached'), 'danger', error.status, 10);
            this.help.showArticle(this.gettextCatalog.getString('590a049b0428634b4a32d13d'));
            throw error;
        });
    }

    process(data) {
        this.data = data;
        this.dataInitialState = angular.copy(this.data);

        this.data.file_headers_mappings = invert(this.data.file_headers_mappings);

        if (keys(this.data.file_headers_mappings).length === 0) {
            const fileHeadersMappingsKeys = keys(this.data.file_headers);
            this.data.file_headers_mappings = reduceObject((result, value, key) => {
                if (includes(key, fileHeadersMappingsKeys)) {
                    result[key] = key;
                }
                return result;
            }, {}, this.serverConstants.data.csv_import.supported_headers);
        }

        this.values_to_constants_mapping = reduceObject((result, object, constant) => {
            if (!(keys(object).length === 1 && object[''] === null)) {
                result[constant] = {};
                each((array, key) => {
                    each((value) => {
                        result[constant][value] = key || null;
                    }, array);
                }, object);
            }
            return result;
        }, {}, this.data.file_constants_mappings);

        if (this.data.tag_list === undefined) {
            this.data.tag_list = [];
        }

         /* istanbul ignore next */
        this.$log.debug('import', this.data);
    }

    get(importId) {
        if (this.data && this.data.id === importId) {
            return Promise.resolve(this.data);
        }

        this.values_to_constants_mapping = {};

        this.blockUI.start();
        return this.api.get(
            `account_lists/${this.api.account_list_id}/imports/csv/${importId}`,
            {
                include: 'sample_contacts,sample_contacts.addresses,sample_contacts.primary_person,sample_contacts.primary_person.email_addresses,sample_contacts.primary_person.phone_numbers,sample_contacts.spouse,sample_contacts.spouse.email_addresses,sample_contacts.spouse.phone_numbers'
            }
        ).then((data) => {
            this.blockUI.reset();
            this.process(data);
        });
    }

    save() {
        if (this.data.tag_list) {
            this.data.tag_list = joinComma(this.data.tag_list);
        }

        this.data.file_headers_mappings = omitBy(isNil, this.data.file_headers_mappings);

        this.data.file_constants_mappings = reduceObject((result, obj, constant) => {
            result[constant] = {};
            each((value, key) => {
                if (value === 'null' || value === null) {
                    value = '';
                }
                if (!result[constant][value]) {
                    result[constant][value] = [];
                }
                result[constant][value].push(key);
            }, obj);
            return result;
        }, {}, this.values_to_constants_mapping);

        this.data.file_constants_mappings = reduceObject((result, constant, header) => {
            if (this.serverConstants.data.csv_import.constants[constant] && !result[constant]) {
                result[constant] = {'': []};
            }

            if (result[constant]) {
                const mappedConstants = flatten(values(result[constant]));
                const unmappedConstants = difference(this.data.file_constants[header], mappedConstants);
                result[constant][''] = union(result[constant][''], unmappedConstants);
                if (result[constant][''].length === 0) {
                    delete result[constant][''];
                }
            }
            return result;
        }, this.data.file_constants_mappings, this.data.file_headers_mappings);

        this.data.file_headers_mappings = invert(this.data.file_headers_mappings);

        const patch = createPatch(this.dataInitialState, this.data);

        this.blockUI.start();
        return this.api.put({
            url: `account_lists/${this.api.account_list_id}/imports/csv/${this.data.id}?include=sample_contacts,sample_contacts.addresses,sample_contacts.primary_person,sample_contacts.primary_person.email_addresses,sample_contacts.primary_person.phone_numbers,sample_contacts.spouse,sample_contacts.spouse.email_addresses,sample_contacts.spouse.phone_numbers`,
            data: patch,
            type: 'imports'
        }).then((data) => {
            this.blockUI.reset();
            this.process(data);
            this.next(data.id);
            return data;
        }, (data) => {
            this.blockUI.reset();
            /* istanbul ignore next */
            this.$log.error(data);
            if (has('data.errors', data)) {
                each(error => {
                    this.alerts.addAlert(error.detail, 'danger', null, 10);
                }, data.data.errors);
            } else {
                this.alerts.addAlert(
                    this.gettextCatalog.getString(
                        'Unable to save your CSV import settings - See help docs or send us a message with your CSV attached'),
                    'danger', 10);
            }

            throw data;
        });
    }

    next(importId) {
        switch (this.$state.$current.name) {
            case 'tools.import.csv.upload':
                this.$state.go('tools.import.csv.headers', { importId: importId });
                break;
            case 'tools.import.csv.headers':
                if (keys(this.values_to_constants_mapping).length === 0) {
                    this.$state.go('tools.import.csv.preview', { importId: importId });
                } else {
                    this.$state.go('tools.import.csv.values', { importId: importId });
                }
                break;
            case 'tools.import.csv.values':
                this.$state.go('tools.import.csv.preview', { importId: importId });
                break;
            default:
                this.reset();
                this.$state.go('tools');
        }
    }

    back() {
        switch (this.$state.$current.name) {
            case 'tools.import.csv.preview':
                if (keys(this.values_to_constants_mapping).length === 0) {
                    this.$state.go('tools.import.csv.headers', { importId: this.data.id });
                } else {
                    this.$state.go('tools.import.csv.values', { importId: this.data.id });
                }
                break;
            case 'tools.import.csv.values':
                this.$state.go('tools.import.csv.headers', { importId: this.data.id });
                break;
            case 'tools.import.csv.headers':
                this.reset();
                this.$state.go('tools.import.csv.upload');
                break;
            default:
                this.reset();
                this.$state.go('tools');
        }
    }
}

import blockUI from 'angular-block-ui';
import gettextCatalog from 'angular-gettext';
import ngFileUpload from 'ng-file-upload';
import uiRouter from '@uirouter/angularjs';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import help from 'common/help/help.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.import.csv.service', [
    blockUI, gettextCatalog, ngFileUpload, uiRouter,
    alerts, api, help, serverConstants
]).service('importCsv', CsvService).name;
