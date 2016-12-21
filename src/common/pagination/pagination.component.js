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
}

const Pagination = {
    controller: PaginationController,
    template: require('./pagination.html'),
    bindings: {
        to: '<',
        from: '<',
        totalPages: '<',
        total: '<',
        page: '=',
        onChange: '&'
    }
};

export default angular.module('mpdx.common.pagination.component', [])
    .component('pagination', Pagination).name;
