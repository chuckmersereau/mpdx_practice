import service from './api.service';
import { assign } from 'lodash/fp';

const jsonApiResponse = {
    data: {
        id: 234
    }
};

const transformedResponse = {
    id: 234
};

const jsonApiErrorResponse = {
    errors: [{
        status: 'bad_request',
        source: { pointer: '/data/attributes/updated_in_db_at' },
        title: 'has to be sent in the list of attributes in order to update resource',
        detail: 'Updated in db at has to be sent in the list of attributes in order to update resource'
    }]
};

describe('common.api.service', () => {
    let api, $httpBackend, log, alerts;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _$httpBackend_, $log, _alerts_) => {
            alerts = _alerts_;
            api = _api_;
            log = $log;
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
        beforeEach(() => {
            api.$window = {
                _satellite: {
                    track: () => {}
                }
            };
            spyOn(api.$window._satellite, 'track').and.callFake(() => {});
        });
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
            it('should send adobe analytics a failure event', () => {
                $httpBackend.expectGET('/api/v1/contacts').respond(500, jsonApiErrorResponse);

                api.get('contacts').then(() => {
                    fail('should have returned an error');
                }).catch(() => {
                    expect(api.$window._satellite.track).toHaveBeenCalledWith('aa-mpdx-api-error');
                });
                $httpBackend.flush();
            });
        });
        it('should auto add params with autoParams true', () => {
            spyOn(api, '$http').and.callFake(() => Promise.resolve());
            api.call({
                url: 'contacts',
                method: 'get',
                data: {
                    filter: {
                        a: 'b'
                    }
                }
            });
            expect(api.$http).toHaveBeenCalledWith({
                method: jasmine.any(String),
                url: jasmine.any(String),
                data: jasmine.any(Object),
                params: { filter: { a: 'b' } },
                headers: jasmine.any(Object),
                paramSerializer: jasmine.any(String),
                responseType: jasmine.any(String),
                transformRequest: jasmine.any(Function),
                transformResponse: jasmine.any(Array),
                cacheService: jasmine.any(Boolean),
                timeout: jasmine.any(Number)
            });
        });
        it('shouldn\'t auto add params with autoParams false', () => {
            spyOn(api, '$http').and.callFake(() => Promise.resolve());
            api.call({
                url: 'contacts',
                method: 'get',
                autoParams: false,
                data: {
                    filter: {
                        a: 'b'
                    }
                }
            });
            expect(api.$http).toHaveBeenCalledWith({
                method: jasmine.any(String),
                url: jasmine.any(String),
                data: jasmine.any(Object),
                params: {},
                headers: jasmine.any(Object),
                paramSerializer: jasmine.any(String),
                responseType: jasmine.any(String),
                transformRequest: jasmine.any(Function),
                transformResponse: jasmine.any(Array),
                cacheService: jasmine.any(Boolean),
                timeout: jasmine.any(Number)
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
    describe('serializeData', () => {
        beforeEach(() => {
            spyOn(api, 'serialize').and.callFake(() => 'a');
        });
        it('should serialize an object', () => {
            expect(api.serializeData({ id: 1 }, 'contact', 'b', 'post')).toEqual('"a"');
        });
        it('should serialize an array', () => {
            expect(api.serializeData([{ id: 1 }, { id: 2 }], 'contact', 'b', 'post')).toEqual('{"data":["a","a"]}');
            expect(api.serialize).toHaveBeenCalledWith('contact', 'b', { id: 1 }, 'post');
            expect(api.serialize).toHaveBeenCalledWith('contact', 'b', { id: 2 }, 'post');
        });
    });
    describe('getParams', () => {
        beforeEach(() => {
            spyOn(log, 'error').and.callFake(() => {});
        });
        it('should error on bad entity', () => {
            expect(api.getParams({ id: 1 }, 'donkey', true)).toEqual({ id: 1 });
            expect(log.error).toHaveBeenCalledWith('undefined attributes for model: donkey in api.service');
        });
        it('should set params for jsonapi-serializer', () => {
            expect(api.getParams([{ id: 1 }, 'bulk'], undefined, true)).toEqual({ 0: { id: 1 }, 1: 'bulk' });
        });
        it('should handle non-serialized requests', () => {
            expect(api.getParams({ id: 1 }, 'donkey', false)).toEqual({ id: 1 });
            expect(log.error).not.toHaveBeenCalled();
        });
    });
    describe('transformRequest', () => {
        it('shouldn\'t serialize', () => {
            spyOn(api, 'serializeData').and.callFake(() => {});
            expect(api.transformRequest({ id: 1 }, 'contact/1', 'put', 'contact', false, false)).toEqual('{"id":1}');
            expect(api.serializeData).not.toHaveBeenCalled();
        });
    });
    describe('handleOverride', () => {
        beforeEach(() => {
            spyOn(api, 'getTypeOverride').and.callFake(() => 'a');
            spyOn(api, 'cleanFilters').and.callFake(() => 'b');
        });
        it('should return default if no override', () => {
            expect(api.handleOverride(
                false, { Accept: 'application/vnd.api+json' }, 'get', true, 'contacts', 'contacts', { id: 1 })
            ).toEqual({
                headers: { Accept: 'application/vnd.api+json' },
                method: 'get',
                doSerialization: true,
                data: { id: 1 }
            });
        });
        it('should handle override', () => {
            expect(api.handleOverride(
                true, { Accept: 'application/vnd.api+json' }, 'get', true, 'contacts', 'contacts', { id: 1 })
            ).toEqual({
                headers: {
                    Accept: 'application/vnd.api+json',
                    'X-HTTP-Method-Override': 'GET'
                },
                method: 'post',
                doSerialization: false,
                data: { id: 1, data: 'a', filter: 'b' }
            });
        });
    });
    describe('getTypeOverride', () => {
        it('should return type if type', () => {
            expect(api.getTypeOverride('contacts', 'contact')).toEqual({ type: 'contact' });
        });
        it('should return type if no type', () => {
            expect(api.getTypeOverride('contacts', undefined)).toEqual({ type: 'contacts' });
        });
    });
    describe('callFailed', () => {
        const ex = new Error('a');
        const request = 'request';
        let deferred = Promise;
        const errorMessage = 'error';
        let overridePromise = false;
        beforeEach(() => {
            spyOn(api, 'gettext').and.callThrough();
            spyOn(api, 'call').and.callFake(() => Promise.resolve());
        });
        it('should handle override', () => {
            spyOn(deferred, 'reject').and.callFake(() => {});
            api.callFailed(ex, request, deferred, errorMessage, true);
            expect(deferred.reject).toHaveBeenCalled();
        });
        it('should translate a default error message', () => {
            spyOn(alerts, 'addAlert').and.callFake(() => Promise.resolve());
            const msg = 'An error occurred while contacting the server.';
            api.callFailed(ex, request, deferred, undefined, overridePromise);
            expect(api.gettext).toHaveBeenCalledWith(msg);
            expect(alerts.addAlert).toHaveBeenCalledWith(msg, 'danger', 0, true);
        });
    });
});