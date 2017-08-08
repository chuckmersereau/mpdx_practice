import joinComma from "common/fp/joinComma";
import reduceObject from "common/fp/reduceObject";

class ImportGoogleService {
    constructor(
        api
    ) {
        this.api = api;
    }

    save(data) {
        let transformedData = angular.copy(data);

        transformedData.tag_list = joinComma(transformedData.tag_list);
        transformedData.group_tags = reduceObject((result, tags, key) => {
            result[key] = joinComma(tags);
            return result;
        }, {}, transformedData.group_tags);

        return this.api.post({
            url: `account_lists/${this.api.account_list_id}/imports/google`,
            data: transformedData,
            type: 'imports'
        });
    }
}

import api from 'common/api/api.service';

export default angular.module('mpdx.tools.import.google.service', [
    api
]).service('importGoogle', ImportGoogleService).name;