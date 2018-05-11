import 'angular-block-ui';
import 'angular-gettext';
import * as Upload from 'ng-file-upload';
import {
    concat,
    defaultTo,
    difference,
    findIndex,
    findKey,
    includes,
    invert,
    isNil,
    keys,
    merge,
    omitBy,
    reduce,
    values
} from 'lodash/fp';
import { StateService } from '@uirouter/core';
import alerts, { AlertsService } from '../../../common/alerts/alerts.service';
import api, { ApiService } from '../../../common/api/api.service';
import createPatch from '../../../common/fp/createPatch';
import help, { HelpService } from '../../../common/help/help.service';
import joinComma from '../../../common/fp/joinComma';
import reduceObject from '../../../common/fp/reduceObject';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import uiRouter from '@uirouter/angularjs';

export class ImportCsvService {
    data: any;
    dataInitialState: any;
    blockUI: IBlockUIService;
    values_to_constants_mappings: any;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $state: StateService,
        blockUI: IBlockUIService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private Upload: ng.angularFileUpload.IUploadService,
        private alerts: AlertsService,
        private api: ApiService,
        private help: HelpService,
        private serverConstants: ServerConstantsService
    ) {
        this.blockUI = blockUI.instances.get('tools-import-csv');
    }
    $onInit(): void {
        this.reset();
    }
    reset(): void {
        this.data = null;
        this.dataInitialState = null;
        this.values_to_constants_mappings = {};
    }
    upload(file: any): ng.IPromise<void> {
        this.blockUI.start();
        return this.Upload.upload({
            method: 'POST',
            url: `${this.api.apiUrl}account_lists/${this.api.account_list_id}/imports/csv`,
            data: {
                data: {
                    type: 'imports',
                    attributes: { file: file }
                }
            }
        }).then((resp: any) => {
            this.blockUI.reset();
            if (resp.data.data.id) {
                this.next(resp.data.data.id);
            }
        }).catch((error) => {
            this.blockUI.reset();
            /* istanbul ignore next */
            this.$log.error(error);
            this.alerts.addAlert(this.gettextCatalog.getString('Invalid CSV file - See help docs or send us a message with your CSV attached'), 'danger', error.status);
            this.help.showArticle(this.gettextCatalog.getString('590a049b0428634b4a32d13d'));
            throw error;
        });
    }
    private process(data: any): void {
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
    get(importId: string): ng.IPromise<void> {
        if (this.data && this.data.id === importId) {
            return this.$q.resolve(this.data);
        }

        this.values_to_constants_mappings = {};

        this.blockUI.start();
        return this.api.get(`account_lists/${this.api.account_list_id}/imports/csv/${importId}`, {
            include: 'sample_contacts,sample_contacts.addresses,sample_contacts.primary_person,'
            + 'sample_contacts.primary_person.email_addresses,sample_contacts.primary_person.phone_numbers,'
            + 'sample_contacts.spouse,sample_contacts.spouse.email_addresses,sample_contacts.spouse.phone_numbers'
        }).then((data) => {
            this.blockUI.reset();
            this.process(data);
        });
    }
    constantsMappingsToValueMappings(constantsMappings: any, fileConstants: any, fileHeadersMappings: any): any {
        return reduceObject((result, array, key) => {
            result[key] = this.reduceConstants(array);

            result[key] = fileConstants && fileHeadersMappings
                ? this.mergeFileConstants(result, key, fileConstants, fileHeadersMappings)
                : result[key];

            return result;
        }, {}, constantsMappings);
    }
    private reduceConstants(array: any[]): any {
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
    private mergeFileConstants(result: any, key: string, fileConstants: any, fileHeadersMappings: any): any {
        const values = keys(result[key]);
        const allValues = this.getConstantValues(key, fileConstants, fileHeadersMappings);
        const unmappedValues = reduce((object, csvValue) => {
            object[csvValue] = '';
            return object;
        }, {}, difference(allValues, values));
        return merge(unmappedValues, result[key]);
    }
    private valueMappingsToConstantsMappings(valueMappings: any, fileConstants: any, fileHeadersMappings: any): any {
        valueMappings = this.buildValueMappings(valueMappings, fileHeadersMappings);

        return reduceObject((result, object, key) => {
            result[key] = this.buildConstantValues(object);

            result[key] = fileConstants && fileHeadersMappings
                ? this.buildFileConstantValues(result, key, fileConstants, fileHeadersMappings)
                : result[key];

            return result;
        }, {}, valueMappings);
    }
    private buildFileConstantValues(result: any, key: string, fileConstants: any, fileHeadersMappings: any): any {
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
    private buildConstantValues(object: any): any[] {
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
    private buildValueMappings(valueMappings: any, fileHeadersMappings: any): any {
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
    private getConstantValues(constant: string, fileConstants: any[], fileHeadersMappings: any): any[] {
        const key = findKey((item) => item === constant, fileHeadersMappings);
        return defaultTo([], fileConstants[key]);
    }
    save(): ng.IPromise<any> {
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

        const errorMessage = this.gettextCatalog.getString('Unable to save your CSV import settings - See help docs or send us a message with your CSV attached');

        return this.api.put({
            url: `account_lists/${this.api.account_list_id}/imports/csv/${this.data.id}?include=sample_contacts,sample_contacts.addresses,sample_contacts.primary_person,sample_contacts.primary_person.email_addresses,sample_contacts.primary_person.phone_numbers,sample_contacts.spouse,sample_contacts.spouse.email_addresses,sample_contacts.spouse.phone_numbers`,
            data: patch,
            type: 'imports',
            errorMessage: errorMessage
        }).then((data: any) => {
            this.blockUI.reset();
            this.process(data);
            this.next(data.id);
            return data;
        }, (data) => {
            this.blockUI.reset();
            this.data.file_headers_mappings = invert(this.data.file_headers_mappings);
            /* istanbul ignore next */
            this.$log.error(data);
            throw data;
        });
    }
    next(importId: string): void {
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
    back(): void {
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

export default angular.module('mpdx.tools.import.csv.service', [
    'blockUI', 'gettext', Upload, uiRouter,
    alerts, api, help, serverConstants
]).service('importCsv', ImportCsvService).name;
