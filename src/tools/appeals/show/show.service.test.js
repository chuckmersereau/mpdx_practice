import service from './show.service';

describe('common.appealsShow.service', () => {
    let appealsShow, api;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_appealsShow_, _api_) => {
            api = _api_;
            api.account_list_id = 2;
            appealsShow = _appealsShow_;
        });
    });
    describe('getAppeal', () => {
        it('should hit the api', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve('a'));
            appealsShow.getAppeal(123).then((data) => {
                expect(api.get).toHaveBeenCalledWith({
                    url: 'appeals/123',
                    data: {
                        include: 'donations',
                        filter: {
                            account_list_id: 2
                        }
                    },
                    deSerializationOptions: jasmine.any(Object)
                });
                expect(data).toEqual('a');
                done();
            });
        });
    });
});
