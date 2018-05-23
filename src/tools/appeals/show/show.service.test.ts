import service from './show.service';

describe('common.appealsShow.service', () => {
    let appealsShow, api, q, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_appealsShow_, _api_, $q, $rootScope) => {
            api = _api_;
            q = $q;
            rootScope = $rootScope;
            api.account_list_id = 2;
            appealsShow = _appealsShow_;
        });
    });

    describe('getAppeal', () => {
        it('should hit the api', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve('a'));
            appealsShow.getAppeal(123).then((data) => {
                expect(api.get).toHaveBeenCalledWith({
                    url: 'appeals/123',
                    data: {
                        filter: {
                            account_list_id: 2
                        }
                    },
                    deSerializationOptions: jasmine.any(Object)
                });
                expect(data).toEqual('a');
                done();
            });
            rootScope.$digest();
        });
    });
});
