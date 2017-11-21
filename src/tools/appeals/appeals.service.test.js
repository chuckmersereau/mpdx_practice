import service from './appeals.service';

describe('tools.appeals.service', () => {
    let appeals, alerts, accounts, api;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _alerts_, _appeals_, _accounts_, _api_) => {
            accounts = _accounts_;
            alerts = _alerts_;
            appeals = _appeals_;
            api = _api_;
        });
    });
    describe('appealSearch', () => {
        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            appeals.appealSearch('a');
            expect(api.get).toHaveBeenCalledWith({
                url: 'appeals',
                data: {
                    filter: {
                        account_list_id: api.account_list_id,
                        wildcard_search: 'a'
                    },
                    fields: {
                        appeals: 'name'
                    },
                    per_page: 6
                },
                overrideGetAsPost: true
            });
        });
    });
    describe('setPrimaryAppeal', () => {
        beforeEach(() => {
            accounts.current = { primary_appeal: null };
            spyOn(alerts, 'addAlert').and.callFake(() => {});
        });
        it('should add the contact to the appeal', () => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            appeals.setPrimaryAppeal({ id: 1 });
            expect(accounts.saveCurrent).toHaveBeenCalledWith();
        });
        it('should alert success', (done) => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.resolve());
            appeals.setPrimaryAppeal({ id: 1 }).then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Appeal successfully set to primary');
                done();
            });
        });
        it('should alert failure', (done) => {
            spyOn(accounts, 'saveCurrent').and.callFake(() => Promise.reject());
            appeals.setPrimaryAppeal({ id: 1 }).catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Unable to set Appeal as primary', 'danger');
                done();
            });
        });
    });
});
