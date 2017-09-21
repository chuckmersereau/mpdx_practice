import service from './api.service';
import assign from 'lodash/fp/assign';

const jsonApiResponse = {
    data: {
        id: 234
    }
};

const jsonApiArrayResponse = {
    data: [{
        id: 234
    }, {
        id: 345
    }]
};

const transformedResponse = {
    id: 234
};

const transformedArrayResponse = [{
    id: 234
}, {
    id: 345
}];

const jsonApiErrorResponse = {
    errors: [{
        status: 'bad_request',
        source: { pointer: '/data/attributes/updated_in_db_at' },
        title: 'has to be sent in the list of attributes in order to update resource',
        detail: 'Updated in db at has to be sent in the list of attributes in order to update resource'
    }]
};

describe('common.api.service', () => {
    let api, $httpBackend;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _$httpBackend_) => {
            api = _api_;
            $httpBackend = _$httpBackend_;
        });
    });
    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('constructor', () => {
        it('should default language', () => {
            expect(api.language).toEqual('en-US');
        });
    });
    describe('call', () => {
        describe('promise', () => {
            it('should send a simple get request', () => {
                $httpBackend.expectGET('/api/v1/contacts').respond(200, jsonApiResponse);

                api.get('contacts').then((data) => {
                    expect(data).toEqual(transformedResponse);
                }).catch(() => {
                    fail('should have returned Success');
                });
                $httpBackend.flush();
            });
            it('should handle an error in a get request', () => {
                $httpBackend.expectGET('/api/v1/contacts').respond(500, jsonApiErrorResponse);

                api.get('contacts').then(() => {
                    fail('should have returned an error');
                }).catch((response) => {
                    expect(response.status).toEqual(500);
                });
                $httpBackend.flush();
            });
        });
    });

    describe('get', () => {
        it('should send a simple get request', () => {
            $httpBackend.expectGET('/api/v1/contacts').respond(200, jsonApiResponse);

            api.get('contacts').then((data) => {
                expect(data).toEqual(transformedResponse);
            }).catch(() => {
                fail('should have returned Success');
            });
            $httpBackend.flush();
        });
    });

    describe('post', () => {
        it('should send a simple post request', () => {
            $httpBackend.expectPOST('/api/v1/contacts').respond(200, jsonApiResponse);

            api.post('contacts').then((data) => {
                expect(data).toEqual(transformedResponse);
            }).catch(() => {
                fail('should have returned Success');
            });
            $httpBackend.flush();
        });
        it('should send a simple delete request', () => {
            $httpBackend.expectDELETE('/api/v1/contacts/1').respond(200, jsonApiResponse);

            api.delete('contacts/1').then((data) => {
                expect(data).toEqual(transformedResponse);
            }).catch(() => {
                fail('should have returned Success');
            });
            $httpBackend.flush();
        });
    });

    describe('encodeURLarray', () => {
        it('should encode an array of values', () => {
            expect(api.encodeURLarray(['handles spaces', '?&'])).toEqual([ 'handles%20spaces', '%3F%26' ]);
        });
    });

    describe('enablePutOverwrite', () => {
        it('should add overwrite', () => {
            expect(api.enablePutOverwrite({ data: { attributes: { id: 1 } } }, 'put')).toEqual({ data: { attributes: { id: 1, overwrite: true } } });
        });
        it('shouldn\'t add overwrite', () => {
            expect(api.enablePutOverwrite({ data: { attributes: { id: 1 } } }, 'post')).toEqual({ data: { attributes: { id: 1 } } });
        });
    });

    describe('appendTransform', () => {
        it('should create an array', () => {
            expect(api.appendTransform('a', 'b')).toEqual(['a', 'b']);
        });
        it('should handle an array', () => {
            expect(api.appendTransform(['a'], 'b')).toEqual(['a', 'b']);
        });
    });

    describe('cleanFilters', () => {
        it('should remove empty strings', () => {
            expect(api.cleanFilters({
                a: ''
            })).toEqual({});
        });
        it('should pull empty strings from array', () => {
            expect(api.cleanFilters({
                a: ['', 'b', 'c']
            })).toEqual({ a: 'b,c' });
        });
    });

    describe('removeIdIfUndefined', () => {
        it('should remove undefined objects', () => {
            expect(api.removeIdIfUndefined({ data: { id: 'undefined' } }, 'post')).toEqual({ data: {} });
        });
        it('shouldn\'t remove defined objects', () => {
            expect(api.removeIdIfUndefined({ data: { id: '1' } }, 'post')).toEqual({ data: { id: '1' } });
        });
    });

    describe('deserialize', () => {
        it('should deserialize valid data', (done) => {
            spyOn(api, 'isDataObject').and.callFake(() => true);
            api.deserialize(jsonApiResponse, {}).then((data) => {
                expect(api.isDataObject).toHaveBeenCalledWith(jsonApiResponse);
                expect(data).toEqual(assign(transformedResponse, { meta: {} }));
                done();
            });
        });
        it('should deserialize valid data', () => {
            spyOn(api, 'isDataObject').and.callFake(() => false);
            expect(api.deserialize({ a: 'b' }, {})).toEqual({ a: 'b' });
            expect(api.isDataObject).toHaveBeenCalledWith({ a: 'b' });
        });
    });

    describe('isDataObject', () => {
        it('should return true if object and contains data attribute', () => {
            expect(api.isDataObject({ data: {} })).toBeTruthy();
        });
        it('should return false if object and doesn\'t contain data attribute', () => {
            expect(api.isDataObject({})).toBeFalsy();
        });
        it('should return false if not an object', () => {
            expect(api.isDataObject('a')).toBeFalsy();
        });
    });
    describe('doBeforeSerialization', () => {
        it('should run the function', () => {
            const doStuff = () => 'a';
            expect(api.doBeforeSerialization(doStuff, {})).toEqual('a');
        });
        it('should return data', () => {
            const doStuff = 'a';
            expect(api.doBeforeSerialization(doStuff, {})).toEqual({});
        });
    });
    describe('deserializeData', () => {
        beforeEach(() => {
            spyOn(api, 'deserialize').and.callFake(() => 'a');
        });
        it('should deserialize an object', () => {
            expect(api.deserializeData({ id: 1 }, 'b')).toEqual('a');
        });
        it('should deserialize an array', () => {
            expect(api.deserializeData([{ id: 1 }, { id: 2 }], 'b')).toEqual(['a', 'a']);
            expect(api.deserialize).toHaveBeenCalledWith({ id: 1 }, 'b');
            expect(api.deserialize).toHaveBeenCalledWith({ id: 2 }, 'b');
        });
    });
    describe('transformResponse', () => {
        beforeEach(() => {
            spyOn(api, 'appendTransform').and.callFake(() => Promise.resolve());
        });
        it('should call appendTransform', (done) => {
            api.transformResponse(null, true, {}).then(() => {
                expect(api.appendTransform).toHaveBeenCalledWith(api.$http.defaults.transformResponse,
                    jasmine.any(Function));
                done();
            });
        });
    });
    describe('afterTransform', () => {
        beforeEach(() => {
            spyOn(api, 'doBeforeSerialization').and.callFake(() => 'a');
            spyOn(api, 'deserializeData').and.callFake(() => 'b');
        });
        it('should deserialize', () => {
            expect(api.afterTransform({ id: 1 }, null, false)).toEqual('a');
            expect(api.doBeforeSerialization).toHaveBeenCalledWith(null, { id: 1 });
        });
        it('should not deserialize', () => {
            expect(api.afterTransform({ id: 1 }, null, true)).toEqual('b');
        });
    });
});