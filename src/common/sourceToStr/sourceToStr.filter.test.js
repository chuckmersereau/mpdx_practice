import filters from './sourceToStr.filter';

describe('common.sourceToStr.filter', () => {
    let $filter;
    beforeEach(() => {
        angular.mock.module(filters);
        inject((_$filter_) => {
            $filter = _$filter_;
        });
    });
    xit('output a formatted date', () => {
        expect($filter('sourceToStr')('')).toEqual(1);
    });
});