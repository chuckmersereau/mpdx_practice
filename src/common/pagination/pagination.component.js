import range from 'lodash/fp/range';
import toInteger from 'lodash/fp/toInteger';
import reduceObject from '../fp/reduceObject';

class PaginationController {
    constructor($log) {
        this.windowSize = 5;
        this.$log = $log;
    }

    $onChanges(data) {
        this.meta = reduceObject((result, value, key) => {
            result[key] = toInteger(value);
            return result;
        }, {}, data.meta.currentValue);
    }

    getTotalPages() {
        let pageArray = range(0, this.meta.total_pages);

        if (this.meta.page > this.windowSize + 1) {
            pageArray = pageArray.slice(this.meta.page - this.windowSize, pageArray.length);
            pageArray.unshift(-1);
            pageArray.unshift(0);
        }
        if (this.meta.total_pages > this.meta.page + this.windowSize) {
            pageArray = pageArray.slice(0, pageArray.indexOf(this.meta.page) + this.windowSize - 1);
            pageArray.push(-1);
            pageArray.push(this.meta.total_pages - 1);
        }
        return pageArray;
    }

    goto(page) {
        this.$log.debug(`page change: ${page}`);
        this.onChange({ page: page });
    }

    next() {
        if (this.meta.page === this.meta.total_pages) { return; }
        this.goto(this.meta.page + 1);
    }

    previous() {
        if (this.meta.page === 1) { return; }
        this.goto(this.meta.page - 1);
    }

    from() {
        return Math.ceil((this.meta.page - 1) * this.meta.per_page + 1);
    }

    to() {
        if (this.meta.page === this.meta.total_pages) {
            return this.meta.total_count;
        }

        return this.meta.per_page * this.meta.page;
    }
}

const Pagination = {
    controller: PaginationController,
    template: require('./pagination.html'),
    bindings: {
        meta: '<',
        onChange: '&'
    }
};

export default angular.module('mpdx.common.pagination.component', [])
    .component('pagination', Pagination).name;
