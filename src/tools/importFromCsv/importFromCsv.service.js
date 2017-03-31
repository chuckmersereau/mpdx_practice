import joinComma from "../../common/fp/joinComma";

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

            this.headers_to_fields_mapping = {};
            _.each(this.data.file_headers_mappings, (value, key) => {
                this.headers_to_fields_mapping[value] = key;
            });

            this.values_to_constants_mapping = {};
            _.each(this.data.file_constants_mappings, (obj, constant) => {
                this.values_to_constants_mapping[constant] = {};

                _.each(obj, (value, key) => {
                    this.values_to_constants_mapping[constant][value] = key;
                });
            });

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
        _.each(this.headers_to_fields_mapping, (value, key) => {
            if (value) {
                this.data.file_headers_mappings[value] = key;
            }
        });

        this.data.file_constants_mappings = {};
        _.each(this.values_to_constants_mapping, (obj, constant) => {
            if (this.data.file_headers_mappings[constant]) {
                this.data.file_constants_mappings[constant] = {};

                _.each(obj, (value, key) => {
                    if (!this.data.file_constants_mappings[constant][value]) {
                        this.data.file_constants_mappings[constant][value] = [];
                    }
                    this.data.file_constants_mappings[constant][value].push(key);
                });
            }
        });

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