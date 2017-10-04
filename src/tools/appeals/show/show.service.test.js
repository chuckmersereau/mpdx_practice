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
    describe('getAppealContacts', () => {
        it('should hit the api', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve('a'));
            appealsShow.getAppealContacts(123).then((data) => {
                expect(api.get).toHaveBeenCalledWith('appeals/123/appeal_contacts', {
                    include: 'contact',
                    per_page: 9000,
                    fields: {
                        contact: 'name,pledge_amount,pledge_currency,pledge_frequency'
                    }
                });
                expect(data).toEqual('a');
                done();
            });
        });
    });
    describe('getPledges', () => {
        it('should hit the api', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve('a'));
            appealsShow.getPledges(123).then((data) => {
                expect(api.get).toHaveBeenCalledWith('account_lists/2/pledges', {
                    include: 'contact,donations',
                    fields: {
                        contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
                    },
                    filter: {
                        appeal_id: 123
                    }
                });
                expect(data).toEqual('a');
                done();
            });
        });
    });
});
