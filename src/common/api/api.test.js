import service from './api.service';

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
    });

    describe('encodeURLarray', () => {
        it('should encode an array of values', () => {
            expect(api.encodeURLarray(['handles spaces', '?&'])).toEqual([ 'handles%20spaces', '%3F%26' ]);
        });
    });
});
