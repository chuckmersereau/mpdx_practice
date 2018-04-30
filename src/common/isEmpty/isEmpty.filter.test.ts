import filters from './isEmpty.filter';

describe('The test filter', () => {
    let $filter;
    beforeEach(() => {
        angular.mock.module(filters);
        inject((_$filter_) => {
            $filter = _$filter_;
        });
    });
    it('should be true', () => {
        expect($filter('isEmpty')('')).toBeTruthy();
    });
    it('should be false', () => {
        expect($filter('isEmpty')('a')).toBeFalsy();
    });
});