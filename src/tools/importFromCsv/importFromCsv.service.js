const each = require('lodash/fp/each').convert({ 'cap': false });
const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import joinComma from "../../common/fp/joinComma";
import difference from 'lodash/fp/difference';
import flatMap from 'lodash/fp/flatMap';
import values from 'lodash/fp/values';
import union from 'lodash/fp/union';

class ImportFromCsvService {
    api;
    blockUI;

    constructor(
        $log, $q, Upload,
        api
    ) {
        this.$log = $log;
        this.$q = $q;
        this.Upload = Upload;
        this.api = api;

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

            this.headers_to_fields_mapping = reduce((result, value, key) => {
                result[value] = key;
                return result;
            }, {}, this.data.file_headers_mappings);

            this.values_to_constants_mapping = reduce((result, obj, constant) => {
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

        this.data.file_headers_mappings = {};
        each((value, key) => {
            if (value) {
                this.data.file_headers_mappings[value] = key;
            }
        }, this.headers_to_fields_mapping);

        this.data.file_constants_mappings = {};
        each((obj, constant) => {
            if (this.data.file_headers_mappings[constant]) {
                this.data.file_constants_mappings[constant] = {};

                each((value, key) => {
                    if (!this.data.file_constants_mappings[constant][value]) {
                        this.data.file_constants_mappings[constant][value] = [];
                    }
                    this.data.file_constants_mappings[constant][value].push(key);
                }, obj);
            }
        }, this.values_to_constants_mapping);

        // add unmapped constants to empty key. eg: {'': ['a', 'b', 'c']}
        each((obj, constant) => {
            const constantKey = this.data.file_headers_mappings[constant];

            if (constantKey) {
                const constants = this.data.file_constants[constantKey];
                const mappedConstants = flatMap(values(obj));
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