import { assign, reduce, sortBy, toInteger } from 'lodash/fp';
import service from './filters.service';

describe('contacts.sidebar.filter.service', () => {
    let api, filters, q, rootScope;

    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _filters_, $q, $rootScope) => {
            api = _api_;
            filters = _filters_;
            q = $q;
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
            expect(filters.getDataFromApi).toHaveBeenCalledWith(undefined, undefined);
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

    describe('getDataFromApi', () => {
        let spy;
        beforeEach(() => {
            spy = spyOn(api, 'get').and.callFake(() => q.resolve());
        });

        it('should call the api', () => {
            filters.getDataFromApi('contacts');
            expect(api.get).toHaveBeenCalledWith('contacts', { filter: { account_list_id: null } });
        });

        it('should handle case where api returns null', (done) => {
            filters.getDataFromApi('contacts').then((response) => {
                expect(response).toEqual({ data: [], params: {}, defaultParams: {} });
                done();
            });
            rootScope.$digest();
        });

        describe('api returns data', () => {
            const data = [
                {
                    "name": "address_historic",
                    "type": "single_checkbox",
                    "default_selection": false,
                    "id": "2"
                }, {
                    "name": "appeal",
                    "type": "multiselect",
                    "default_selection": "no_appeal, all_appeals",
                    "id": "4"
                }, {
                    "name": "status",
                    "type": "multiselect",
                    "default_selection": "active, null",
                    "multiple": true,
                    "id": "3"
                }, {
                    "name": "donation_amount_range",
                    "type": "text",
                    "default_selection": "",
                    "options": [{ "id":"min" }, { "id":"max" }],
                    "id": "1"
                }
            ]

            beforeEach(() => {
                spy.and.callFake(() => q.resolve(data));
            });

            it('should mutate data', (done) => {
                spyOn(filters, 'mutateData');
                filters.getDataFromApi('contacts').then((response) => {
                    expect(filters.mutateData).toHaveBeenCalledWith(sortBy((filter) => toInteger(filter.id), data));
                    done();
                });
                rootScope.$digest();
            });

            it('should sort filters by id', (done) => {
                filters.getDataFromApi('contacts').then((response) => {
                    expect(reduce((result, filter) => {
                        result.push(filter.id);
                        return result;
                    }, [], response.data[0].children)).toEqual(['1', '2', '3', '4']);
                    done();
                });
                rootScope.$digest();
            });

            it('should set defaultParams', (done) => {
                filters.getDataFromApi('contacts').then((response) => {
                    expect(response.defaultParams).toEqual({
                        donation_amount_range: { min: '', max: '' },
                        address_historic: ['false'],
                        status: ['active', 'null'],
                        appeal: ['no_appeal', 'all_appeals']
                    });
                    done();
                });
                rootScope.$digest();
            });

            it('should set params as copy of defaultParams', (done) => {
                filters.getDataFromApi('contacts').then((response) => {
                    expect(response.params.donation_amount_range).not.toBe(
                        response.defaultParams.donation_amount_range
                    );
                    expect(response.params).toEqual(response.defaultParams)
                    done();
                });
                rootScope.$digest();
            });

            it('should set params from defaultParams allowing argument params to override', (done) => {
                filters.getDataFromApi('contacts', { donation_amount_range: '' }).then((response) => {
                    expect(response.params).toEqual(
                        assign(response.defaultParams, { donation_amount_range: '' })
                    );
                    done();
                });
                rootScope.$digest();
            });

        })
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

    describe('makeDefaultParams', () => {
        beforeEach(() => {
            spyOn(filters, 'splitToArr').and.returnValue('split');
        });

        it('should map to default params', () => {
            const data = [{
                default_selection: '123',
                name: 'a',
                parent: null
            }];
            expect(filters.makeDefaultParams(data)).toEqual({ a: 'split' });
        });
    });

    describe('mutateData', () => {
        beforeEach(() => {
            spyOn(filters, 'splitToArr').and.returnValue('split');
        });

        it('should split default selection', () => {
            const data = [{
                default_selection: '123',
                title: 'a',
                parent: null
            }];
            expect(filters.mutateData(data)).toEqual([{ default_selection: 'split', title: 'a', parent: null }]);
        });
    });

    describe('splitToArr', () => {
        it('should split a comma delimited list', () => {
            expect(filters.splitToArr('a, b,c')).toEqual(['a', 'b', 'c']);
        });
    });
});
