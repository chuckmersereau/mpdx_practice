import { find, get, isArray } from 'lodash/fp';

class HeaderController {
    isArray(obj) {
        return isArray(obj);
    }
    getOption(filter, id) {
        return get('name', find({ id: id }, filter.options));
    }
}

const header = {
    template: require('./header.html'),
    controller: HeaderController,
    bindings: {
        filters: '<',
        filterParams: '<',
        filterDefaultParams: '<',
        selectedTags: '<',
        rejectedTags: '<',
        displayFilters: '&',
        invertFilter: '&',
        removeFilter: '&',
        rejectTag: '&',
        selectTag: '&',
        removeSelectedTag: '&',
        removeRejectedTag: '&'
    }
};

export default angular.module('mpdx.common.filters.header.component', [])
    .component('headerFilterDisplay', header).name;