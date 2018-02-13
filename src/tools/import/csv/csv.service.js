import {
    concat,
    defaultTo,
    difference,
    each,
    findIndex,
    findKey,
    has,
    includes,
    invert,
    isNil,
    keys,
    merge,
    omitBy,
    reduce,
    values
} from 'lodash/fp';
import createPatch from 'common/fp/createPatch';
import joinComma from 'common/fp/joinComma';
import reduceObject from 'common/fp/reduceObject';

class CsvService {
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
        this.values_to_constants_mappings = {};
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

        this.values_to_constants_mappings = this.constantsMappingsToValueMappings(
            this.data.file_constants_mappings, this.data.file_constants, this.data.file_headers_mappings
        );

        if (keys(this.data.file_headers_mappings).length === 0) {
            const fileHeadersMappingsKeys = keys(this.data.file_headers);
            this.data.file_headers_mappings = reduceObject((result, value, key) => {
                if (includes(key, fileHeadersMappingsKeys)) {
                    result[key] = key;
                }
                return result;
            }, {}, this.serverConstants.data.csv_import.supported_headers);
        }

        this.data.tag_list = defaultTo([], this.data.tag_list);

        /* istanbul ignore next */
        this.$log.debug('import', this.data);
    }
    get(importId) {
        if (this.data && this.data.id === importId) {
            return Promise.resolve(this.data);
        }

        this.values_to_constants_mappings = {};

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
    constantsMappingsToValueMappings(constantsMappings, fileConstants, fileHeadersMappings) {
        return reduceObject((result, array, key) => {
            result[key] = this.reduceConstants(array);

            result[key] = fileConstants && fileHeadersMappings
                ? this.mergeFileConstants(result, key, fileConstants, fileHeadersMappings)
                : result[key];

            return result;
        }, {}, constantsMappings);
    }
    reduceConstants(array) {
        return reduce((result, constant) => {
            const group = reduce((group, value) => {
                if (value) {
                    group[value] = constant.id === '' ? null : constant.id;
                }
                return group;
            }, {}, constant.values);
            return merge(result, group);
        }, {}, array);
    }
    mergeFileConstants(result, key, fileConstants, fileHeadersMappings) {
        const values = keys(result[key]);
        const allValues = this.getConstantValues(key, fileConstants, fileHeadersMappings);
        const unmappedValues = reduce((object, csvValue) => {
            object[csvValue] = '';
            return object;
        }, {}, difference(allValues, values));
        return merge(unmappedValues, result[key]);
    }
    valueMappingsToConstantsMappings(valueMappings, fileConstants, fileHeadersMappings) {
        valueMappings = this.buildValueMappings(valueMappings, fileHeadersMappings);

        return reduceObject((result, object, key) => {
            result[key] = this.buildConstantValues(object);

            result[key] = fileConstants && fileHeadersMappings
                ? this.buildFileConstantValues(result, key, fileConstants, fileHeadersMappings)
                : result[key];

            return result;
        }, {}, valueMappings);
    }
    buildFileConstantValues(result, key, fileConstants, fileHeadersMappings) {
        const values = reduce((result, object) => concat(result, object.values), [], result[key]);
        const allValues = this.getConstantValues(key, fileConstants, fileHeadersMappings);
        return reduce((object, csvValue) => {
            let constantIndex = findIndex({ id: '' }, object);
            constantIndex = constantIndex > -1 ? constantIndex : object.length;
            object[constantIndex] = defaultTo({ id: '', values: [] }, object[constantIndex]);
            object[constantIndex].values = concat(object[constantIndex].values, csvValue);
            return object;
        }, result[key], difference(allValues, values));
    }
    buildConstantValues(object) {
        return reduceObject((array, constant, value) => {
            constant = constant === null || constant === 'null'
                ? ''
                : constant;
            let constantIndex = findIndex({ id: constant }, array);
            constantIndex = constantIndex > -1 ? constantIndex : array.length;
            array[constantIndex] = defaultTo({ id: constant, values: [] }, array[constantIndex]);
            array[constantIndex].values = concat(array[constantIndex].values, value);
            return array;
        }, [], object);
    }
    buildValueMappings(valueMappings, fileHeadersMappings) {
        valueMappings = defaultTo({}, valueMappings);

        const mappedHeaders = values(fileHeadersMappings);
        const constants = keys(this.serverConstants.data.csv_import.constants);
        return reduce((object, mappedHeader) => {
            if (includes(mappedHeader, constants)) {
                object[mappedHeader] = defaultTo({}, object[mappedHeader]);
            }
            return object;
        }, valueMappings, mappedHeaders);
    }
    getConstantValues(constant, fileConstants, fileHeadersMappings) {
        const key = findKey((item) => item === constant, fileHeadersMappings);
        return defaultTo([], fileConstants[key]);
    }
    save() {
        if (this.data.tag_list) {
            this.data.tag_list = joinComma(this.data.tag_list);
        }

        this.data.file_headers_mappings = omitBy(isNil, this.data.file_headers_mappings);

        this.data.file_constants_mappings = this.valueMappingsToConstantsMappings(
            this.values_to_constants_mappings,
            this.data.file_constants,
            this.data.file_headers_mappings
        );

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
            this.data.file_headers_mappings = invert(this.data.file_headers_mappings);
            /* istanbul ignore next */
            this.$log.error(data);
            if (has('data.errors', data)) {
                each((error) => {
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
        const stateSwitch = (state) => ({
            'tools.import.csv.upload': 'tools.import.csv.headers',
            'tools.import.csv.headers': keys(this.values_to_constants_mappings).length === 0
                ? 'tools.import.csv.preview'
                : 'tools.import.csv.values',
            'tools.import.csv.values': 'tools.import.csv.preview'
        })[state];
        const nextState = stateSwitch(this.$state.$current.name);
        if (nextState) {
            this.$state.go(nextState, { importId: importId });
        } else {
            this.reset();
            this.$state.go('tools');
        }
    }
    back() {
        const stateSwitch = (state) => ({
            'tools.import.csv.preview': keys(this.values_to_constants_mappings).length === 0
                ? 'tools.import.csv.headers'
                : 'tools.import.csv.values',
            'tools.import.csv.values': 'tools.import.csv.headers',
            'tools.import.csv.headers': 'tools.import.csv.upload'
        })[state];
        const nextState = stateSwitch(this.$state.$current.name);
        if (nextState === 'tools.import.csv.upload') {
            this.reset();
            this.$state.go(nextState);
        } else if (nextState) {
            this.$state.go(nextState, { importId: this.data.id });
        } else {
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
