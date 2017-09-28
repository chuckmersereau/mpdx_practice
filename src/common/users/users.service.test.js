import service from './users.service';

describe('common.users.service', () => {
    let $$window, accounts, api, help, language, locale, users;
    beforeEach(() => {
        angular.mock.module(service);
        inject((
            $window,
            _accounts_, _api_, _help_, _language_, _locale_, _users_
        ) => {
            $$window = $window;

            accounts = _accounts_;
            api = _api_;
            help = _help_;
            language = _language_;
            locale = _locale_;
            users = _users_;
        });
    });

    describe('getCurrent', () => {
        let user;
        beforeEach(() => {
            user = { id: 'user_id', preferences: { default_account_list: 'account_list_id' } };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(user));
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            spyOn(accounts, 'swap').and.callFake(() => Promise.resolve());
            spyOn(users, 'redirectUserToStart').and.callFake(() => Promise.reject());
        });

        it('should call api.get', () => {
            users.getCurrent();
            expect(api.get).toHaveBeenCalledWith(
                'user', {
                    include: 'account_lists,email_addresses',
                    fields: {
                        user: 'account_lists,email_addresses,first_name,last_name,options,preferences',
                        account_lists: 'name',
                        email_addresses: 'email,primary'
                    }
                }
            );
        });

        it('should return promise', () => {
            expect(users.getCurrent()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set current as data', (done) => {
                users.getCurrent().then(() => {
                    expect(users.current).toEqual(user);
                    done();
                });
            });

            it('should set currentInitialState as data', (done) => {
                users.getCurrent().then(() => {
                    expect(users.currentInitialState).toEqual(user);
                    done();
                });
            });

            it('should call configureRollbarPerson', (done) => {
                spyOn(users, 'configureRollbarPerson');

                users.getCurrent().then(() => {
                    expect(users.configureRollbarPerson).toHaveBeenCalledWith(user);
                    done();
                });
            });

            it('should call help.updateUser', (done) => {
                spyOn(help, 'updateUser');

                users.getCurrent().then(() => {
                    expect(help.updateUser).toHaveBeenCalledWith(user);
                    done();
                });
            });

            it('should call locale.change', (done) => {
                spyOn(locale, 'change');

                users.getCurrent().then(() => {
                    expect(locale.change).toHaveBeenCalledWith('en-en');
                    done();
                });
            });

            it('should call language.change', (done) => {
                spyOn(language, 'change');

                users.getCurrent().then(() => {
                    expect(language.change).toHaveBeenCalledWith('en-us');
                    done();
                });
            });

            describe('preferences.locale_display set', () => {
                beforeEach(() => {
                    user.preferences.locale_display = 'en-nz';
                });

                it('should call locale.change', (done) => {
                    spyOn(locale, 'change');

                    users.getCurrent().then(() => {
                        expect(locale.change).toHaveBeenCalledWith('en-nz');
                        done();
                    });
                });
            });

            describe('preferences.locale set', () => {
                beforeEach(() => {
                    user.preferences.locale = 'en-nz';
                });

                it('should call language.change', (done) => {
                    spyOn(language, 'change');

                    users.getCurrent().then(() => {
                        expect(language.change).toHaveBeenCalledWith('en-nz');
                        done();
                    });
                });
            });

            describe('preferences.default_account_list set', () => {
                let spy;

                beforeEach(() => {
                    spy = spyOn(users, 'getKeyAccount').and.callFake(() => Promise.resolve());
                    spyOn(users, 'getOptions').and.callFake(() => Promise.resolve());
                });

                describe('promise successful', () => {
                    it('should call accounts.swap with default_account_list', (done) => {
                        users.getCurrent().then(() => {
                            expect(accounts.swap).toHaveBeenCalledWith('account_list_id', 'user_id');
                            done();
                        });
                    });

                    it('should call getOptions', (done) => {
                        users.getCurrent().then(() => {
                            expect(users.getOptions).toHaveBeenCalledWith(true, false);
                            done();
                        });
                    });

                    it('should call getKeyAccount', (done) => {
                        users.getCurrent().then(() => {
                            expect(users.getKeyAccount).toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('promise unsuccessful', () => {
                    beforeEach(() => {
                        spy.and.callFake(() => Promise.reject());
                    });

                    describe('users.currentOptions.setup_position.value !== connect', () => {
                        it('should call redirectUserToStart', (done) => {
                            users.getCurrent().catch(() => {
                                expect(users.redirectUserToStart).toHaveBeenCalled();
                                done();
                            });
                        });
                    });

                    describe('users.currentOptions.setup_position.value !== connect', () => {
                        beforeEach(() => {
                            users.currentOptions = { setup_position: { value: 'connect' } };
                        });

                        it('should call redirectUserToStart', (done) => {
                            users.getCurrent().catch(() => {
                                expect(users.redirectUserToStart).not.toHaveBeenCalled();
                                done();
                            });
                        });
                    });
                });
            });

            describe('localStorage.user_id_accountListId set', () => {
                beforeEach(() => {
                    $$window.localStorage.setItem('user_id_accountListId', 'local_storage_account_list_id');
                });

                it('should call accounts.swap with localStorage.user_id_accountListId', (done) => {
                    users.getCurrent().then(() => {
                        expect(accounts.swap).toHaveBeenCalledWith('local_storage_account_list_id', 'user_id');
                        done();
                    });
                });

                afterEach(() => {
                    $$window.localStorage.removeItem('user_id_accountListId');
                });
            });

            describe('no account list set', () => {
                beforeEach(() => {
                    user.preferences = {};
                });

                it('should call redirectUserToStart', (done) => {
                    users.getCurrent().catch(() => {
                        expect(users.redirectUserToStart).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('reset', () => {
                it('should call getOptions', (done) => {
                    spyOn(users, 'getOptions').and.callFake(() => Promise.resolve());
                    users.getCurrent(true).then(() => {
                        expect(users.getOptions).toHaveBeenCalledWith(true, false);
                        done();
                    });
                });
            });
        });

        describe('cache', () => {
            beforeEach(() => {
                spyOn(users, 'getOptions').and.callFake(() => Promise.resolve());
                users.current = user;
            });

            it('should not call api.get', () => {
                users.getCurrent();
                expect(api.get).not.toHaveBeenCalled();
            });

            it('should call getOptions', () => {
                users.getCurrent();
                expect(users.getOptions).toHaveBeenCalledWith(false, false);
            });

            it('should return promise', () => {
                expect(users.getCurrent()).toEqual(jasmine.any(Promise));
            });

            describe('promise successful', () => {
                it('returns users.current', (done) => {
                    users.getCurrent().then((data) => {
                        expect(data).toEqual(users.current);
                        done();
                    });
                });
            });
        });
    });

    describe('redirectUserToStart', () => {
        beforeEach(() => {
            users.current = { id: 'user_id' };
            spyOn(users, 'setOption').and.callFake(() => Promise.resolve());
        });

        it('should call setOption', () => {
            users.redirectUserToStart();
            expect(users.setOption).toHaveBeenCalledWith({ key: 'setup_position', value: 'start' });
        });

        it('should return promise', () => {
            expect(users.redirectUserToStart()).toEqual(jasmine.any(Promise));
        });

        describe('promise unsuccessful', () => {
            it('sets calls localStorage.removeItem', () => {
                spyOn($$window.localStorage, 'removeItem');
                users.redirectUserToStart().catch(() => {
                    expect($$window.localStorage.removeItem).toHaveBeenCalledWith(
                        'user_id_accountListId'
                    );
                });
            });

            it('sets data to redirect: setup.start', () => {
                users.redirectUserToStart().catch((data) => {
                    expect(data).toEqual({ redirect: 'setup.start' });
                });
            });
        });
    });
});
