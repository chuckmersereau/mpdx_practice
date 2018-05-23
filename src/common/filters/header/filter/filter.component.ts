import { find, get, isArray } from 'lodash/fp';

class FilterController {
    isArray(obj: any): boolean {
        return isArray(obj);
    }
    getOption(filter: any, id: string): string {
        return get('name', find({ id: id }, filter.options));
    }
}

const filter: ng.IComponentOptions = {
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

export default angular.module('mpdx.common.filter.header.filter.component', [])
    .component('filtersHeaderFilter', filter).name;
