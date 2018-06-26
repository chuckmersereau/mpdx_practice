import { compact, concat, find, get, isArray, reduce } from 'lodash/fp';

class FilterController {
    filter: any;
    filterParams: any;
    filters: string[];
    $onChanges() {
        this.filters = compact(
            isArray(this.filterParams[this.filter.name])
                ? reduce((result, value) => {
                    const display = this.getOption(this.filter, value);
                    return display ? concat(result, display) : result;
                }, [], this.filterParams[this.filter.name])
                : [this.getOption(this.filter, this.filterParams[this.filter.name])]);
    }
    private getOption(filter: any, id: string): string {
        return get('name', find({ id: id }, filter.options));
    }
}

const filter: ng.IComponentOptions = {
    template: require('./filter.html'),
    controller: FilterController,
    bindings: {
        filter: '<',
        filterParams: '<',
        invert: '&',
        remove: '&'
    }
};

export default angular.module('mpdx.common.filter.header.filter.component', [])
    .component('filtersHeaderFilter', filter).name;
