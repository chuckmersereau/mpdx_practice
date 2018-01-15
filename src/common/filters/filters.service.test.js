import service from './filters.service';

describe('contacts.service', () => {
    let filters;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_filters_) => {
            filters = _filters_;
        });
    });
    describe('count', () => {
        it('should return a filter count', () => {
            expect(filters.count({ params: { a: 'b' }, defaultParams: {} })).toEqual(1);
        });
    });
    describe('load', () => {
        beforeEach(() => {
            spyOn(filters, 'returnOriginalAsPromise').and.callFake(() => 'a');
            spyOn(filters, 'getDataFromApi').and.callFake(() => 'b');
        });
        it('should return original if data', () => {
            expect(filters.load({ data: 'a', params: 'b', defaultParams: 'c' })).toEqual('a');
            expect(filters.returnOriginalAsPromise).toHaveBeenCalledWith('a', 'b', 'c');
        });
        it('should get data from api', () => {
            expect(filters.load({})).toEqual('b');
            expect(filters.getDataFromApi).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
        });
    });
    describe('returnOriginalAsPromise', () => {
        it('should return the initial values as a promise', (done) => {
            filters.returnOriginalAsPromise('a', 'b', 'c').then((data) => {
                expect(data).toEqual({ data: 'a', params: 'b', defaultParams: 'c' });
                done();
            });
        });
    });
});
