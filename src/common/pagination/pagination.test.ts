import pagination from './pagination';

describe('mpdx.common.pagination', () => {
    describe('from', () => {
        it('should do math', () => {
            expect(pagination.from(1, 25)).toEqual(1);
        });

        it('should do other math', () => {
            expect(pagination.from(2, 25)).toEqual(26);
        });
    });

    describe('to', () => {
        it('should do math', () => {
            expect(pagination.to(1, 25, 5, 120)).toEqual(25);
        });

        it('should do other math', () => {
            expect(pagination.to(5, 25, 5, 120)).toEqual(120);
        });
    });
});