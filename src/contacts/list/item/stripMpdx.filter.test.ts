import filters from './stripMpdx.filter';

describe('common.stripMpdx.filter', () => {
    let $filter;
    beforeEach(() => {
        angular.mock.module(filters);
        inject((_$filter_) => {
            $filter = _$filter_;
        });
    });

    xit('output a formatted date', () => {
        expect($filter('stripMpdx')('')).toEqual(1);
    });
});