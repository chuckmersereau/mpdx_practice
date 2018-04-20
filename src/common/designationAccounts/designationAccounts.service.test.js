import service from './designationAccounts.service';

describe('common.designationAccounts.service', () => {
    let $log, rootScope, api, designationAccounts;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _$log_, _api_, _designationAccounts_) => {
            rootScope = $rootScope;
            $log = _$log_;
            api = _api_;
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
            spyOn(api, 'get').and.callFake(() => Promise.resolve([{ id: 1, organization: { id: 2 } }]));
            spyOn($log, 'debug').and.returnValue();
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
        });

        it('should set data', (done) => {
            expect(designationAccounts.data).toEqual([]);
            designationAccounts.load().then(() => {
                expect(designationAccounts.data).not.toEqual([]);
                done();
            });
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
            });

            describe('reset', () => {
                it('should call the api', () => {
                    designationAccounts.load(true);
                    expect(api.get).toHaveBeenCalled();
                });
            });
        });
    });

    describe('search', () => {
        const keywords = 'my keywords';
        beforeEach(() => {
            spyOn(api, 'get').and.callFake((url, data) => Promise.resolve(data));
        });

        it('should return a promise', () => {
            expect(designationAccounts.search(keywords)).toEqual(jasmine.any(Promise));
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
