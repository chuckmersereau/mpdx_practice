import service from './setup.service';

describe('setup.service', () => {
    let state, accounts, alerts, api, setup, users, q, rootScope;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($q, $rootScope, $state, _accounts_, _alerts_, _api_, _setup_, _users_) => {
            rootScope = $rootScope;
            state = $state;
            accounts = _accounts_;
            alerts = _alerts_;
            api = _api_;
            setup = _setup_;
            users = _users_;
            q = $q;
        });
    });

    describe('next', () => {
        beforeEach(() => {
            spyOn(setup, 'hasAccountLists').and.callFake(() => q.reject({}));
        });

        it('should call hasAccountLists', () => {
            setup.next();
            expect(setup.hasAccountLists).toHaveBeenCalled();
        });

        describe('promise unsuccessful', () => {
            it('should call alerts.addAlert', (done) => {
                spyOn(alerts, 'addAlert');
                setup.next().catch(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(
                        'Something went wrong, please try again.', 'danger'
                    );
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('hasAccountLists', () => {
        beforeEach(() => {
            spyOn(users, 'getCurrent').and.callFake(() => q.resolve());
        });

        it('should call users.getCurrent', () => {
            setup.hasAccountLists();
            expect(users.getCurrent).toHaveBeenCalled();
        });

        describe('promise successful', () => {
            describe('account_lists.length === 0', () => {
                beforeEach(() => {
                    users.current = {
                        account_lists: []
                    };
                });

                describe('state is setup.connect', () => {
                    beforeEach(() => {
                        spyOn(state, 'includes').and.returnValue(true);
                    });

                    it('should not call goConnect', (done) => {
                        spyOn(setup, 'goConnect');
                        setup.hasAccountLists().then(() => {
                            expect(setup.goConnect).not.toHaveBeenCalled();
                            done();
                        });
                        rootScope.$digest();
                    });

                    it('should call addAlert', (done) => {
                        spyOn(alerts, 'addAlert');
                        setup.hasAccountLists().then(() => {
                            expect(alerts.addAlert).toHaveBeenCalledWith(
                                'Something went wrong, please try removing your organization accounts and add them again.',
                                'danger');
                            done();
                        });
                        rootScope.$digest();
                    });
                });

                describe('state is not setup.connect', () => {
                    it('should call goConnect', (done) => {
                        spyOn(setup, 'goConnect');
                        setup.hasAccountLists().then(() => {
                            expect(setup.goConnect).toHaveBeenCalled();
                            done();
                        });
                        rootScope.$digest();
                    });
                });
            });

            describe('account_lists.length === 1', () => {
                beforeEach(() => {
                    users.current = {
                        account_lists: [{}]
                    };
                });

                it('should call setDefaultAccountList', (done) => {
                    spyOn(setup, 'setDefaultAccountList');
                    setup.hasAccountLists().then(() => {
                        expect(setup.setDefaultAccountList).toHaveBeenCalled();
                        done();
                    });
                    rootScope.$digest();
                });
            });

            describe('account_lists.length > 1', () => {
                beforeEach(() => {
                    users.current = {
                        account_lists: [{}, {}]
                    };
                });

                it('should call hasDefaultAccountList', (done) => {
                    spyOn(setup, 'hasDefaultAccountList');
                    setup.hasAccountLists().then(() => {
                        expect(setup.hasDefaultAccountList).toHaveBeenCalled();
                        done();
                    });
                    rootScope.$digest();
                });
            });
        });
    });

    describe('hasDefaultAccountList', () => {
        describe('default_account_list === null', () => {
            beforeEach(() => {
                users.current = {
                    preferences: {
                        default_account_list: null
                    }
                };
            });

            it('should call goAccount', () => {
                spyOn(setup, 'goAccount');
                setup.hasDefaultAccountList();
                expect(setup.goAccount).toHaveBeenCalled();
            });
        });

        describe('default_account_list === account_list_id', () => {
            beforeEach(() => {
                users.current = {
                    preferences: {
                        default_account_list: 'account_list_id'
                    }
                };
            });

            it('should call hasOrganizationAccounts', () => {
                spyOn(setup, 'hasOrganizationAccounts');
                setup.hasDefaultAccountList();
                expect(setup.hasOrganizationAccounts).toHaveBeenCalled();
            });
        });
    });

    describe('hasOrganizationAccounts', () => {
        let accountListSpy, userSpy;
        beforeEach(() => {
            accountListSpy = spyOn(setup, 'getAccountListOrganizationAccounts').and.callFake(() => q.resolve([]));
            userSpy = spyOn(setup, 'getUserOrganizationAccounts').and.callFake(() => q.resolve([]));
        });

        it('should call getAccountListOrganizationAccounts', () => {
            setup.hasOrganizationAccounts();
            expect(setup.getAccountListOrganizationAccounts).toHaveBeenCalled();
        });

        it('should call getUserOrganizationAccounts', () => {
            setup.hasOrganizationAccounts();
            expect(setup.getUserOrganizationAccounts).toHaveBeenCalled();
        });

        describe('promise successful', () => {
            describe('AccountListOrganizationAccounts > 0', () => {
                beforeEach(() => {
                    accountListSpy.and.callFake(() => q.resolve([{}, {}]));
                    spyOn(setup, 'goPreferences');
                });

                it('should call goPreferences', (done) => {
                    setup.hasOrganizationAccounts().then(() => {
                        expect(setup.goPreferences).toHaveBeenCalled();
                        done();
                    });
                    rootScope.$apply();
                });
            });

            describe('UserOrganizationAccounts > 0', () => {
                beforeEach(() => {
                    userSpy.and.callFake(() => q.resolve([{}, {}]));
                    spyOn(setup, 'goPreferences');
                });

                it('should call goPreferences', (done) => {
                    setup.hasOrganizationAccounts().then(() => {
                        expect(setup.goPreferences).toHaveBeenCalled();
                        done();
                    });
                    rootScope.$apply();
                });
            });

            describe('OrganizationAccounts > 2', () => {
                beforeEach(() => {
                    accountListSpy.and.callFake(() => q.resolve([{}, {}]));
                    userSpy.and.callFake(() => q.resolve([{}, {}]));
                    spyOn(setup, 'goPreferences');
                });

                it('should call goPreferences', (done) => {
                    setup.hasOrganizationAccounts().then(() => {
                        expect(setup.goPreferences).toHaveBeenCalled();
                        done();
                    });
                    rootScope.$apply();
                });
            });

            describe('OrganizationAccounts === 0', () => {
                beforeEach(() => {
                    spyOn(setup, 'goConnect');
                });

                it('should call goConnect', (done) => {
                    setup.hasOrganizationAccounts().then(() => {
                        expect(setup.goConnect).toHaveBeenCalled();
                        done();
                    });
                    rootScope.$apply();
                });
            });
        });
    });

    describe('goAccount', () => {
        beforeEach(() => {
            spyOn(setup, 'setPosition').and.callFake(() => q.resolve());
        });

        it('should call setPosition', () => {
            setup.goAccount();
            expect(setup.setPosition).toHaveBeenCalledWith('account');
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go');
                setup.goAccount().then(() => {
                    expect(state.go).toHaveBeenCalledWith('setup.account');
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('goConnect', () => {
        beforeEach(() => {
            spyOn(setup, 'setPosition').and.callFake(() => q.resolve());
        });

        it('should call setPosition', () => {
            setup.goConnect();
            expect(setup.setPosition).toHaveBeenCalledWith('connect');
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go');
                setup.goConnect().then(() => {
                    expect(state.go).toHaveBeenCalledWith('setup.connect');
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('goPreferences', () => {
        beforeEach(() => {
            spyOn(setup, 'setPosition').and.callFake(() => q.resolve());
        });

        it('should call setPosition', () => {
            setup.goPreferences();
            expect(setup.setPosition).toHaveBeenCalledWith('preferences.personal');
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go');
                setup.goPreferences().then(() => {
                    expect(state.go).toHaveBeenCalledWith('setup.preferences.personal');
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('getUserOrganizationAccounts', () => {
        beforeEach(() => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve([{}]));
        });

        it('should call users.getAccountListOrganizationAccounts', () => {
            setup.getUserOrganizationAccounts();
            expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
        });

        describe('promise successful', () => {
            it('should return organization_accounts', (done) => {
                setup.getUserOrganizationAccounts().then((data) => {
                    expect(data).toEqual([{}]);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('getAccountListOrganizationAccounts', () => {
        beforeEach(() => {
            users.current = {
                preferences: {
                    default_account_list: 'account_list_id'
                }
            };
            spyOn(api, 'get').and.callFake(() => q.resolve({
                organization_accounts: [{}]
            }));
        });

        it('should call api.get', () => {
            setup.getAccountListOrganizationAccounts();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/account_list_id',
                { include: 'organization_accounts' }
            );
        });

        describe('promise successful', () => {
            it('should return organization_accounts', (done) => {
                setup.getAccountListOrganizationAccounts().then((data) => {
                    expect(data).toEqual([{}]);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('setDefaultAccountList', () => {
        beforeEach(() => {
            users.current = {
                preferences: {
                    default_account_list: null
                },
                account_lists: [{ id: 'account_list_id' }],
                id: 'user_id'
            };
            spyOn(users, 'saveCurrent').and.callFake(() => q.resolve());
            spyOn(accounts, 'swap').and.callFake(() => q.resolve());
            spyOn(setup, 'hasOrganizationAccounts').and.callFake(() => q.resolve());
        });

        it('should set default_account_list', () => {
            setup.setDefaultAccountList();
            expect(users.current.preferences.default_account_list).toEqual('account_list_id');
        });

        it('should call users.saveCurrent', () => {
            setup.setDefaultAccountList();
            expect(users.saveCurrent).toHaveBeenCalled();
        });

        describe('promise successful', () => {
            it('should call accounts.swap', (done) => {
                setup.setDefaultAccountList().then(() => {
                    expect(accounts.swap).toHaveBeenCalledWith('account_list_id', 'user_id', true);
                    done();
                });
                rootScope.$digest();
            });

            it('should call hasOrganizationAccounts', (done) => {
                setup.setDefaultAccountList().then(() => {
                    expect(setup.hasOrganizationAccounts).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('setPosition', () => {
        beforeEach(() => {
            spyOn(users, 'setOption').and.callFake(() => q.resolve());
        });

        describe('new position', () => {
            beforeEach(() => {
                users.currentOptions = {
                    setup_position: {
                        value: null
                    }
                };
            });

            it('should set users.currentOptions.setup_position.value', () => {
                setup.setPosition('connect');
                expect(users.currentOptions.setup_position.value).toEqual('connect');
            });

            it('should call users.setOption', () => {
                setup.setPosition('connect');
                expect(users.setOption).toHaveBeenCalledWith({ key: 'setup_position', value: 'connect' });
            });
        });

        describe('same position', () => {
            beforeEach(() => {
                users.currentOptions = {
                    setup_position: {
                        value: 'connect'
                    }
                };
            });

            it('should not call users.setOption', () => {
                setup.setPosition('connect');
                expect(users.setOption).not.toHaveBeenCalledWith({ key: 'setup_position', value: 'connect' });
            });
        });
    });
});
