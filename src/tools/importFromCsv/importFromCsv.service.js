const each = require('lodash/fp/each').convert({ 'cap': false });
import joinComma from "../../common/fp/joinComma";
import difference from 'lodash/fp/difference';
import flatten from 'lodash/fp/flatten';
import values from 'lodash/fp/values';
import union from 'lodash/fp/union';
import reduceObject from '../../common/fp/reduceObject';

class ImportFromCsvService {
    api;
    blockUI;

    constructor(
        $log, $q, Upload,
        api, serverConstants
    ) {
        this.$log = $log;
        this.$q = $q;
        this.Upload = Upload;
        this.api = api;
        this.serverConstants = serverConstants;

        this.data = null;
        this.headers_to_fields_mapping = {};
        this.values_to_constants_mapping = {};
    }

    upload(file) {
        let promise = this.$q.defer();

        this.Upload.upload({
            url: `${this.api.apiUrl}account_lists/${this.api.account_list_id}/imports/csv`,
            data: {
                data: {
                    type: 'imports',
                    attributes: {file: file}
                }
            }
        }).then((resp) => {
            this.data = resp.data.data;

            promise.resolve(this.get(this.data.id));
        }, (resp) => {
            promise.reject(resp);
        });

        return promise.promise;
    }

    get(importId) {
        return this.api.get({
            url: `account_lists/${this.api.account_list_id}/imports/csv/${importId}`,
            data: {
                include: 'sample_contacts'
            }
        }).then((data) => {
            this.data = data;

            this.headers_to_fields_mapping = reduceObject((result, value, key) => {
                result[value] = key;
                return result;
            }, {}, this.data.file_headers_mappings);

            this.values_to_constants_mapping = reduceObject((result, obj, constant) => {
                result[constant] = {};
                each((value, key) => {
                    result[constant][value] = key;
                }, obj);
                return result;
            }, {}, this.data.file_constants_mappings);

            this.$log.debug('import');
            this.$log.debug(this.data);

            return this.data;
        });
    }

    update() {
        if (this.data.tag_list) {
            this.data.tag_list = joinComma(this.data.tag_list); //fix for api mis-match
        }

        this.data.file_headers_mappings = reduceObject((result, value, key) => {
            if (value) {
                result[value] = key;
            }
            return result;
        }, {}, this.headers_to_fields_mapping);

        this.data.file_constants_mappings = reduceObject((result, obj, constant) => {
            if (this.data.file_headers_mappings[constant]) {
                result[constant] = {};

                each((value, key) => {
                    if (!result[constant][value]) {
                        result[constant][value] = [];
                    }
                    result[constant][value].push(key);
                }, obj);
            }
            return result;
        }, {}, this.values_to_constants_mapping);

        // add unselected constants
        this.data.file_constants_mappings = reduceObject((result, value, key) => {
            if (this.serverConstants.data.csv_import.constants[key] && !result[key]) {
                result[key] = {'': []};
            }
            return result;
        }, this.data.file_constants_mappings, this.data.file_headers_mappings);

        // add unmapped constants to empty key. eg: {'': ['a', 'b', 'c']}
        each((obj, constant) => {
            const constantKey = this.data.file_headers_mappings[constant];

            if (constantKey) {
                const constants = this.data.file_constants[constantKey];
                const mappedConstants = flatten(values(obj));
                const unmappedCosntants = difference(constants, mappedConstants);

                if (unmappedCosntants.length) {
                    if (!obj['']) {
                        obj[''] = [];
                    }

                    obj[''] = union(obj[''], unmappedCosntants);
                }
            }
        }, this.data.file_constants_mappings);

        let promise = this.$q.defer();

        this.api.put({
            url: `account_lists/${this.api.account_list_id}/imports/csv/${this.data.id}?include=sample_contacts,sample_contacts.addresses,sample_contacts.primary_person,sample_contacts.primary_person.email_addresses,sample_contacts.primary_person.phone_numbers,sample_contacts.spouse`,
            data: this.data,
            type: 'imports'
        }).then((data) => {
            this.data = data;

            if (this.data.tag_list === undefined) {
                this.data.tag_list = [];
            }

            this.$log.debug('import');
            this.$log.debug(this.data);

            promise.resolve(this.data);
        }, (error) => {
            promise.reject(error);
        });

        return promise.promise;
    }
}

export default angular.module('mpdx.tools.importFromCsv.service', [])
    .service('importFromCsv', ImportFromCsvService).name;