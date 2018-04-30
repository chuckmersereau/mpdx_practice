import { find, get, isArray } from 'lodash/fp';

class FilterController {
    isArray(obj: any) {
        return isArray(obj);
    }
    getOption(filter, id) {
        return get('name', find({ id: id }, filter.options));
    }
}

const filter = {
    template: require('./filter.html'),
    controller: FilterController,
    bindings: {
        filter: '<',
        filterParams: '<',
        filterDefaultParams: '<',
        invert: '&',
        remove: '&'
    }
};

export default angular.module('mpdx.common.filters.header.filter.component', [])
    .component('filtersHeaderFilter', filter).name;
