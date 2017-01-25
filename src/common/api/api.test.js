import api from './api.service';

const jsonApiResponse = {
    data: {
        success: true
    }
};

const transformedResponse = {
    success: true
};

const jsonApiErrorResponse = {
    errors: [{
        status: "bad_request",
        source: {pointer: "/data/attributes/updated_in_db_at"},
        title: "has to be sent in the list of attributes in order to update resource",
        detail: "Updated in db at has to be sent in the list of attributes in order to update resource"
    }]
};

describe('common.api.service', () => {
    let service, $httpBackend;
    beforeEach(() => {
        angular.mock.module(api);
        inject((_api_, _$httpBackend_) => {
            service = _api_;
            $httpBackend = _$httpBackend_;
        });
    });
    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('call', () => {
        describe('promise', () => {
            it('should send a simple get request', () => {
                $httpBackend.expectGET('/api/v1/contacts').respond(200, jsonApiResponse);

                service.get('contacts').then((data) => {
                    expect(data).toEqual(transformedResponse);
                }).catch(() => {
                    fail('should have returned Success');
                });
                $httpBackend.flush();
            });
            it('should handle an error in a get request', () => {
                $httpBackend.expectGET('/api/v1/contacts').respond(500, jsonApiErrorResponse);

                service.get('contacts').then(() => {
                    fail('should have returned an error');
                }).catch((response) => {
                    expect(response.status).toEqual(500);
                    // expect(response.data.errors).toExist();
                });
                $httpBackend.flush();
            });

            describe('cache', () => {
                it('should make a XHR request since it is not cached', () => {
                    $httpBackend.expectGET('/api/v1/contacts').respond(200, jsonApiResponse);

                    service.get({ url: 'contacts', cache: false }).then((data) => {
                        expect(data).toEqual(transformedResponse);
                    }).catch(() => {
                        fail('should have returned Success');
                    });
                    $httpBackend.flush();
                });

                it('should make not make an XHR request the second time', () => {
                    $httpBackend.expectGET('/api/v1/contacts').respond(200, jsonApiResponse);

                    function runApiCall() {
                        service.call({ method: 'get', url: 'contacts', cache: true }).then((data) => {
                            expect(data).toEqual(transformedResponse);
                        }).catch(() => {
                            fail('should have returned Success');
                        });
                    }

                    runApiCall();
                    $httpBackend.flush();
                    runApiCall();
                });
            });
        });
    });

    describe('get', () => {
        it('should send a simple get request', () => {
            $httpBackend.expectGET('/api/v1/contacts').respond(200, jsonApiResponse);

            service.get('contacts').then((data) => {
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

            service.post('contacts').then((data) => {
                expect(data).toEqual(transformedResponse);
            }).catch(() => {
                fail('should have returned Success');
            });
            $httpBackend.flush();
        });
    });

    describe('encodeURLarray', () => {
        it('should encode an array of values', () => {
            expect(service.encodeURLarray(['handles spaces', '?&'])).toEqual([ 'handles%20spaces', '%3F%26' ]);
        });
    });
});
