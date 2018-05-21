import { isEqual, sumBy } from 'lodash/fp';

class HeaderController {
    displayFilters: () => boolean;
    filterDefaultParams: any;
    filterParams: any;
    filters: any[];
    invertFilter: (any) => void;
    isCollapsed: boolean;
    removeFilter: (any) => void;
    rejectedTags: any[];
    selectedTags: any[];
    constructor() {
        this.isCollapsed = true;
    }
    // invert(filter: any): void {
    //     this.invertFilter({ $filter: filter });
    // }
    // remove(filter: any): void {
    //     this.removeFilter({ $filter: filter });
    // }
    // count(): number {
    //     return this.countTags() + this.sumFilters(this.filters);
    // }
    // private sumFilters(filters: any[]): number {
    //     return sumBy((filter: any) => {
    //         return this.countInUse(filter) + this.sumFilters(filter.children);
    //     }, filters);
    // }
    // private countTags(): number {
    //     return this.selectedTags.length + this.rejectedTags.length;
    // }
    // private countInUse(filter: any): number {
    //     return this.filterInUse(filter) ? 1 : 0;
    // }
    // filterInUse(filter: any): boolean {
    //     return filter.reverse || (
    //         filter.type !== 'container'
    //         && this.filterParams[filter.name].length > 0
    //         && !isEqual(this.filterParams[filter.name], this.filterDefaultParams[filter.name])
    //     );
    // }
    // display(): boolean {
    //     return this.displayFilters() && this.count() > 0;
    // }
}

const header: ng.IComponentOptions = {
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

export default angular.module('mpdx.common.filter.header.component', [])
    .component('filtersHeader', header).name;
