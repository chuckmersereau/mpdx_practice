import service from './designationAccounts.service';

describe('common.designationAccounts.service', () => {
    let $log, rootScope, api, designationAccounts, q;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _$log_, _api_, _designationAccounts_, $q) => {
            rootScope = $rootScope;
            $log = _$log_;
            api = _api_;
            q = $q;
            designationAccounts = _designationAccounts_;
            api.account_list_id = 'account_list_id';
        });
    });

    describe('constructor', () => {
        it('should set default variables', () => {
            expect(designationAccounts.data).toEqual([]);
            expect(designationAccounts.list).toEqual([]);
            expect(designationAccounts.organizations).toEqual([]);
            expect(designationAccounts.selected).toEqual([]);
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve([{ id: 1, organization: { id: 2 } }]));
            spyOn($log, 'debug').and.callFake(() => {});
        });

        it('should call api.get', () => {
            designationAccounts.load();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/account_list_id/designation_accounts', {
                    include: 'organization'
                }
            );
        });

        it('should log promise results to console', (done) => {
            designationAccounts.load().then(() => {
                expect($log.debug).toHaveBeenCalled();
                done();
            });
            rootScope.$digest();
        });

        it('should set call updateBalance', (done) => {
            spyOn(designationAccounts, 'updateBalance');
            designationAccounts.load().then(() => {
                expect(designationAccounts.updateBalance).toHaveBeenCalled();
                done();
            });
            rootScope.$digest();
        });

        it('should set data', (done) => {
            expect(designationAccounts.data).toEqual([]);
            designationAccounts.load().then(() => {
                expect(designationAccounts.data).not.toEqual([]);
                done();
            });
            rootScope.$digest();
        });

        describe('data already set', () => {
            const data = [
                { id: 'designation_account_0' },
                { id: 'designation_account_1' }
            ];

            beforeEach(() => {
                designationAccounts.data = data;
            });

            it('should not call the api', () => {
                designationAccounts.load();
                expect(api.get).not.toHaveBeenCalled();
            });

            it('should return already fetched data', (done) => {
                designationAccounts.load().then((data) => {
                    expect(data).toEqual(designationAccounts.data);
                    done();
                });
                rootScope.$digest();
            });

            describe('reset', () => {
                it('should call the api', () => {
                    designationAccounts.load(true);
                    expect(api.get).toHaveBeenCalled();
                });
            });
        });
    });

    describe('save', () => {
        let designationAccount = { id: '123', active: true };
        beforeEach(() => {
            spyOn(api, 'put').and.callFake(() => q.resolve(designationAccount));
        });

        it('should update data', (done) => {
            designationAccounts.data = [{ id: '123', active: false }, { id: '456' }];
            designationAccounts.save(designationAccount).then(() => {
                expect(designationAccounts.data[0]['active']).toEqual(true);
                done();
            });
            rootScope.$digest();
        });

        it('should set call updateBalance', (done) => {
            spyOn(designationAccounts, 'updateBalance');
            designationAccounts.save(designationAccount).then(() => {
                expect(designationAccounts.updateBalance).toHaveBeenCalled();
                done();
            });
            rootScope.$digest();
        });
    });

    describe('search', () => {
        const keywords = 'my keywords';
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => q.resolve(data));
        });

        it('should return a promise', () => {
            expect(designationAccounts.search(keywords)).toEqual(jasmine.any(q));
        });

        it('should call api.get', () => {
            designationAccounts.search(keywords);
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/account_list_id/designation_accounts',
                {
                    filter: {
                        wildcard_search: keywords
                    },
                    fields: {
                        designation_accounts: 'display_name,designation_number'
                    },
                    per_page: 6
                }
            );
        });
    });

    describe('updateBalance', () => {
        it('should set converted_total to 0', () => {
            designationAccounts.data = [];
            designationAccounts.updateBalance();
            expect(designationAccounts.balance).toEqual(0);
        });

        describe('active designations', () => {
            beforeEach(() => {
                designationAccounts.data = [
                    { active: true, converted_balance: 1 },
                    { active: true, converted_balance: 10 },
                    { active: true, converted_balance: 100 }
                ];
            });

            it('should set converted_total to total of active accounts', () => {
                designationAccounts.updateBalance();
                expect(designationAccounts.balance).toEqual(111);
            });
        });

        describe('inactive designations', () => {
            beforeEach(() => {
                designationAccounts.data = [
                    { active: false, converted_balance: 1 },
                    { active: false, converted_balance: 10 },
                    { active: false, converted_balance: 100 }
                ];
            });

            it('should set converted_total to total of active accounts', () => {
                designationAccounts.updateBalance();
                expect(designationAccounts.balance).toEqual(0);
            });
        });

        describe('active and inactive designations', () => {
            beforeEach(() => {
                designationAccounts.data = [
                    { active: true, converted_balance: 1 },
                    { active: false, converted_balance: 1 },
                    { active: true, converted_balance: 10 },
                    { active: false, converted_balance: 10 },
                    { active: true, converted_balance: 100 },
                    { active: false, converted_balance: 100 }
                ];
            });

            it('should set converted_total to total of active accounts', () => {
                designationAccounts.updateBalance();
                expect(designationAccounts.balance).toEqual(111);
            });
        });
    });

    describe('resetSelected', () => {
        it('should set selected to []', () => {
            designationAccounts.selected = ['abc', 'def'];
            designationAccounts.resetSelected();
            expect(designationAccounts.selected).toEqual([]);
        });

        it('should call $emit', () => {
            spyOn(rootScope, '$emit').and.callThrough();
            designationAccounts.resetSelected();
            expect(rootScope.$emit).toHaveBeenCalledWith('designationAccountSelectorChanged', []);
        });
    });
});
