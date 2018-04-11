import { sumBy } from 'lodash/fp';

class HeaderController {
    constructor() {
        this.isCollapsed = true;
    }
    invert(filter) {
        this.invertFilter({ $filter: filter });
    }
    remove(filter) {
        this.removeFilter({ $filter: filter });
    }
    count() {
        let count = this.selectedTags.length + this.rejectedTags.length;
        count += sumBy((filter) => {
            let filterCount = 0;
            if (this.filterInUse(filter)) filterCount += 1;
            sumBy((child) => {
                if (this.filterInUse(child)) filterCount += 1;
            }, filter.children);
            return filterCount;
        }, this.filters);
        return count;
    }
    filterInUse(filter) {
        return filter.reverse || (
            filter.type !== 'container'
            && this.filterParams[filter.name].length > 0
            && this.filterParams[filter.name] !== this.filterDefaultParams[filter.name]
        );
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
    .component('filtersHeader', header).name;
