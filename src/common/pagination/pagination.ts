export default class Pagination {
    static from(page, perPage) {
        return Math.ceil((page - 1) * perPage + 1);
    }
    static to(page, perPage, totalPages, totalCount) {
        if (page === totalPages) {
            return totalCount;
        }

        return perPage * page;
    }
}
