export default class Pagination {
    static from(page: number, perPage: number): number {
        return Math.ceil((page - 1) * perPage + 1);
    }
    static to(page: number, perPage: number, totalPages: number, totalCount: number): number {
        if (page === totalPages) {
            return totalCount;
        }

        return perPage * page;
    }
}
