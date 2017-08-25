import service from './setup.service';

describe('setup.service', () => {
    let state, alerts, api, setup, users;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, $state, _alerts_, _api_, _setup_, _users_) => {
            api = _api_;
            state = $state;
            alerts = _alerts_;
            setup = _setup_;
            users = _users_;
        });
    });

    describe('next', () => {
        beforeEach(() => {
            spyOn(setup, 'hasAccountLists').and.callFake(() => Promise.reject());
        });

        it('should call hasAccountLists', () => {
            setup.next();
            expect(setup.hasAccountLists).toHaveBeenCalled();
        });

        it('should return promise', () => {
            expect(setup.next()).toEqual(jasmine.any(Promise));
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
            });
        });
    });

    describe('hasAccountLists', () => {
        beforeEach(() => {
            spyOn(users, 'getCurrent').and.callFake(() => Promise.resolve());
        });

        it('should call users.getCurrent', () => {
            setup.hasAccountLists();
            expect(users.getCurrent).toHaveBeenCalled();
        });

        it('should return promise', () => {
            expect(setup.hasAccountLists()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            describe('account_lists.length === 0', () => {
                beforeEach(() => {
                    users.current = {
                        account_lists: []
                    };
                });

                it('should call goConnect', (done) => {
                    spyOn(setup, 'goConnect');
                    setup.hasAccountLists().then(() => {
                        expect(setup.goConnect).toHaveBeenCalled();
                        done();
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
            accountListSpy = spyOn(setup, 'getAccountListOrganizationAccounts').and.callFake(() => Promise.resolve([]));
            userSpy = spyOn(setup, 'getUserOrganizationAccounts').and.callFake(() => Promise.resolve([]));
        });

        it('should call getAccountListOrganizationAccounts', () => {
            setup.hasOrganizationAccounts();
            expect(setup.getAccountListOrganizationAccounts).toHaveBeenCalled();
        });

        it('should call getUserOrganizationAccounts', () => {
            setup.hasOrganizationAccounts();
            expect(setup.getUserOrganizationAccounts).toHaveBeenCalled();
        });

        it('should return promise', () => {
            expect(setup.hasOrganizationAccounts()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            describe('AccountListOrganizationAccounts > 0', () => {
                beforeEach(() => {
                    accountListSpy.and.callFake(() => Promise.resolve([{}, {}]));
                    spyOn(setup, 'goPreferences');
                });

                it('should call goPreferences', (done) => {
                    setup.hasOrganizationAccounts().then(() => {
                        expect(setup.goPreferences).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('UserOrganizationAccounts > 0', () => {
                beforeEach(() => {
                    userSpy.and.callFake(() => Promise.resolve([{}, {}]));
                    spyOn(setup, 'goPreferences');
                });

                it('should call goPreferences', (done) => {
                    setup.hasOrganizationAccounts().then(() => {
                        expect(setup.goPreferences).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('OrganizationAccounts > 2', () => {
                beforeEach(() => {
                    accountListSpy.and.callFake(() => Promise.resolve([{}, {}]));
                    userSpy.and.callFake(() => Promise.resolve([{}, {}]));
                    spyOn(setup, 'goPreferences');
                });

                it('should call goPreferences', (done) => {
                    setup.hasOrganizationAccounts().then(() => {
                        expect(setup.goPreferences).toHaveBeenCalled();
                        done();
                    });
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
                });
            });
        });
    });

    describe('goAccount', () => {
        beforeEach(() => {
            spyOn(setup, 'setPosition').and.callFake(() => Promise.resolve());
        });

        it('should call setPosition', () => {
            setup.goAccount();
            expect(setup.setPosition).toHaveBeenCalledWith('account');
        });

        it('should return promise', () => {
            expect(setup.goAccount()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go');
                setup.goAccount().then(() => {
                    expect(state.go).toHaveBeenCalledWith('setup.account');
                    done();
                });
            });
        });
    });

    describe('goConnect', () => {
        beforeEach(() => {
            spyOn(setup, 'setPosition').and.callFake(() => Promise.resolve());
        });

        it('should call setPosition', () => {
            setup.goConnect();
            expect(setup.setPosition).toHaveBeenCalledWith('connect');
        });

        it('should return promise', () => {
            expect(setup.goConnect()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go');
                setup.goConnect().then(() => {
                    expect(state.go).toHaveBeenCalledWith('setup.connect');
                    done();
                });
            });
        });
    });

    describe('goPreferences', () => {
        beforeEach(() => {
            spyOn(setup, 'setPosition').and.callFake(() => Promise.resolve());
        });

        it('should call setPosition', () => {
            setup.goPreferences();
            expect(setup.setPosition).toHaveBeenCalledWith('preferences.personal');
        });

        it('should return promise', () => {
            expect(setup.goPreferences()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go');
                setup.goPreferences().then(() => {
                    expect(state.go).toHaveBeenCalledWith('setup.preferences.personal');
                    done();
                });
            });
        });
    });

    describe('getUserOrganizationAccounts', () => {
        beforeEach(() => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve([{}]));
        });

        it('should call users.getAccountListOrganizationAccounts', () => {
            setup.getUserOrganizationAccounts();
            expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
        });

        it('should return promise', () => {
            expect(setup.getUserOrganizationAccounts()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should return organization_accounts', (done) => {
                setup.getUserOrganizationAccounts().then((data) => {
                    expect(data).toEqual([{}]);
                    done();
                });
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
            spyOn(api, 'get').and.callFake(() => Promise.resolve({
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

        it('should return promise', () => {
            expect(setup.getAccountListOrganizationAccounts()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should return organization_accounts', (done) => {
                setup.getAccountListOrganizationAccounts().then((data) => {
                    expect(data).toEqual([{}]);
                    done();
                });
            });
        });
    });

    describe('setDefaultAccountList', () => {
        beforeEach(() => {
            users.current = {
                preferences: {
                    default_account_list: null
                },
                account_lists: [{ id: 'account_list_id' }]
            };
            spyOn(users, 'saveCurrent').and.callFake(() => Promise.resolve());
        });

        it('should set default_account_list', () => {
            setup.setDefaultAccountList();
            expect(users.current.preferences.default_account_list).toEqual('account_list_id');
        });

        it('should call users.saveCurrent', () => {
            setup.setDefaultAccountList();
            expect(users.saveCurrent).toHaveBeenCalled();
        });

        it('should return promise', () => {
            expect(setup.setDefaultAccountList()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call hasOrganizationAccounts', (done) => {
                spyOn(setup, 'hasOrganizationAccounts');
                setup.setDefaultAccountList().then(() => {
                    expect(setup.hasOrganizationAccounts).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    describe('setPosition', () => {
        beforeEach(() => {
            spyOn(users, 'setOption').and.callFake(() => Promise.resolve());
        });

        describe('new position', () => {
            beforeEach(() => {
                users.currentOptions = {
                    setup_position: {
                        value: null
                    }
                };
            });

            it('should return promise', () => {
                expect(setup.setPosition('connect')).toEqual(jasmine.any(Promise));
            });

            it('should set users.currentOptions.setup_position.value', () => {
                setup.setPosition('connect');
                expect(users.currentOptions.setup_position.value).toEqual('connect');
            });

            it('should call users.setOption', () => {
                setup.setPosition('connect');
                expect(users.setOption).toHaveBeenCalledWith({ value: 'connect' });
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

            it('should return promise', () => {
                expect(setup.setPosition('connect')).toEqual(jasmine.any(Promise));
            });

            it('should not call users.setOption', () => {
                setup.setPosition('connect');
                expect(users.setOption).not.toHaveBeenCalledWith({ value: 'connect' });
            });
        });
    });
});
