class PaginationController {
    getTotalPages() {
        return Array(this.totalPages);
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
