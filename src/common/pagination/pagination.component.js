class PaginationController {
    constructor() {
        this.windowSize = 5;
        this.page = parseInt(this.page);
        this.totalPages = parseInt(this.totalPages);
    }

    getTotalPages() {
        let pageArray = _.range(this.totalPages);

        if (this.page > this.windowSize + 1) {
            pageArray = pageArray.slice(this.page - this.windowSize, pageArray.length);
            pageArray.unshift(-1);
            pageArray.unshift(0);
        }
        if (this.totalPages > this.page + this.windowSize) {
            pageArray = pageArray.slice(0, pageArray.indexOf(this.page) + this.windowSize - 1);
            pageArray.push(-1);
            pageArray.push(this.totalPages - 1);
        }

        return pageArray;
    }

    goto(page) {
        this.page = page;
        this.onChange({ page: this.page });
    }

    next() {
        if (this.page === this.totalPages) { return; }
        this.goto(this.page + 1);
    }

    previous() {
        if (this.page === 1) { return; }
        this.goto(this.page - 1);
    }

    from() {
        return Math.ceil((this.page - 1) * this.perPage + 1);
    }

    to() {
        if (this.page === this.totalPages) {
            return this.total;
        }

        return this.perPage * this.page;
    }
}

const Pagination = {
    controller: PaginationController,
    template: require('./pagination.html'),
    bindings: {
        totalPages: '<',
        perPage: '<',
        total: '<',
        page: '=',
        onChange: '&'
    }
};

export default angular.module('mpdx.common.pagination.component', [])
    .component('pagination', Pagination).name;
