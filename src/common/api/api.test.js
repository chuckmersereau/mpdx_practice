import api from './api.service';

describe('common.api.service', () => {
    let service, $httpBackend;
    beforeEach(() => {
        angular.mock.module(api);
        inject((_api_, _$httpBackend_) => {
            service = _api_;
            $httpBackend = _$httpBackend_;
        });
    });
    afterEach(() =>  {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('call', () => {
        describe('promise', () => {
            it('should send a simple get request', () =>{
                $httpBackend.expectGET('/api/v1/contacts').respond(200, 'Success');

                service.call('get', 'contacts', {}, null, null, false).then((data) => {
                    expect(data).toEqual('Success');
                }).catch(() => {
                    fail('should have returned Success');
                });
                $httpBackend.flush();
            });
            it('should handle an error in a get request', () => {
                $httpBackend.expectGET('/api/v1/contacts').respond(500, 'Error');

                service.call('get', 'contacts', {}, null, null, false).then(() => {
                    fail('should have returned an error');
                }).catch((response) => {
                    expect(response.data).toEqual('Error');
                });
                $httpBackend.flush();
            });

            describe('cache', () => {
                it('should make a XHR request since it is not cached', () => {
                    $httpBackend.expectGET('/api/v1/contacts').respond(200, 'Success');

                    service.call('get', 'contacts', {}, null, null, true).then((data) => {
                        expect(data).toEqual('Success');
                    }).catch(() => {
                        fail('should have returned Success');
                    });
                    $httpBackend.flush();
                });

                it('should make not make an XHR request the second time', () => {
                    $httpBackend.expectGET('/api/v1/contacts').respond(200, 'Success');

                    function runApiCall(){
                        service.call('get', 'contacts', {}, null, null, true).then((data) => {
                            expect(data).toEqual('Success');
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
        describe('callback', () => {
            it('should send a simple get request', () => {
                $httpBackend.expectGET('/api/v1/contacts').respond(200, 'Success');

                service.call('get', 'contacts', {}, (data) => {
                    expect(data).toEqual('Success');
                }, () => {
                    fail('should have returned Success');
                }, false);

                $httpBackend.flush();
            });
            it('should handle an error in a get request', () => {
                $httpBackend.expectGET('/api/v1/contacts').respond(500, 'Error');

                service.call('get', 'contacts', {}, () => {
                    fail('should have returned an error');
                }, (response) => {
                    expect(response.data).toEqual('Error');
                }, false);

                $httpBackend.flush();
            });

            describe('cache', () => {
                it('should make a XHR request since it is not cached', () => {
                    $httpBackend.expectGET('/api/v1/contacts').respond(200, 'Success');

                    service.call('get', 'contacts', {}, (data) => {
                        expect(data).toEqual('Success');
                    }, () => {
                        fail('should have returned Success');
                    }, true);
                    $httpBackend.flush();
                });

                it('should make not make an XHR request the second time', () => {
                    $httpBackend.expectGET('/api/v1/contacts').respond(200, 'Success');

                    function runApiCall(){
                        service.call('get', 'contacts', {}, (data) => {
                            expect(data).toEqual('Success');
                        }, () => {
                            fail('should have returned Success');
                        }, true);
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
            $httpBackend.expectGET('/api/v1/contacts').respond(200, 'Success');

            service.get('contacts', {}, null, null, false).then((data) => {
                    expect(data).toEqual('Success');
                }).catch(() => {
                    fail('should have returned Success');
                });
            $httpBackend.flush();
        });
    });

    describe('post', () => {
        it('should send a simple post request', () => {
            $httpBackend.expectPOST('/api/v1/contacts').respond(200, 'Success');

            service.post('contacts', {}, null, null, false).then((data) => {
                expect(data).toEqual('Success');
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
