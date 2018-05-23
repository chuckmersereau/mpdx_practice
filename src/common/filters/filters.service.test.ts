import service from './filters.service';

describe('contacts.sidebar.filter.service', () => {
    let filters, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_filters_, $rootScope) => {
            filters = _filters_;
            rootScope = $rootScope;
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
            rootScope.$digest();
        });
    });

    describe('fromStrings', () => {
        const params = {
            activity_type: 'Call',
            status: 'a,b'
        };
        const filterArr = [{ name: 'status', type: 'multiselect' }, { name: 'activity_type', type: '' }];
        it('should split strings', () => {
            expect(filters.fromStrings(params, filterArr).status).toEqual(['a', 'b']);
        });

        it('should leave strings alone', () => {
            expect(filters.fromStrings(params, filterArr).activity_type).toEqual('Call');
        });
    });
});
