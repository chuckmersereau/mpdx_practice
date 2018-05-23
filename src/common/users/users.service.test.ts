import service from './users.service';

describe('common.users.service', () => {
    let $$window, accounts, api, help, language, locale, users, q, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject((
            $window, $q, $rootScope,
            _accounts_, _api_, _help_, _language_, _locale_, _users_
        ) => {
            $$window = $window;

            accounts = _accounts_;
            api = _api_;
            help = _help_;
            language = _language_;
            locale = _locale_;
            users = _users_;
            q = $q;
            rootScope = $rootScope;
        });
    });

    describe('getCurrent', () => {
        let user;
        beforeEach(() => {
            user = { id: 'user_id', preferences: { default_account_list: 'account_list_id' } };
            spyOn(api, 'get').and.callFake(() => q.resolve(user));
            spyOn(api, 'put').and.callFake(() => q.resolve());
            spyOn(accounts, 'swap').and.callFake(() => q.resolve());
            spyOn(help, 'updateUser').and.callFake(() => {});
            spyOn(users, 'redirectUserToStart').and.callFake(() => q.reject());
            spyOn(users, 'configureRollbarPerson').and.callFake(() => {});
            spyOn(language, 'change').and.callFake(() => {});
            spyOn(locale, 'change').and.callFake(() => {});
        });

        it('should call api.get', () => {
            users.getCurrent();
            expect(api.get).toHaveBeenCalledWith(
                'user', {
                    include: 'account_lists,email_addresses,facebook_accounts,family_relationships,'
                      + 'family_relationships.related_person,linkedin_accounts,master_person,'
                      + 'phone_numbers,twitter_accounts,websites'
                }
            );
        });

        it('should return promise', () => {
            expect(users.getCurrent()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should set current as data', (done) => {
                users.getCurrent().then(() => {
                    expect(users.current).toEqual(user);
                    done();
                });
                rootScope.$digest();
            });

            it('should set currentInitialState as data', (done) => {
                users.getCurrent().then(() => {
                    expect(users.currentInitialState).toEqual(user);
                    done();
                });
                rootScope.$digest();
            });

            it('should call configureRollbarPerson', (done) => {
                users.getCurrent().then(() => {
                    expect(users.configureRollbarPerson).toHaveBeenCalledWith(user);
                    done();
                });
                rootScope.$digest();
            });

            it('should call help.updateUser', (done) => {
                users.getCurrent().then(() => {
                    expect(help.updateUser).toHaveBeenCalledWith(user);
                    done();
                });
                rootScope.$digest();
            });

            it('should call locale.change', (done) => {
                users.getCurrent().then(() => {
                    expect(locale.change).toHaveBeenCalledWith('en-en');
                    done();
                });
                rootScope.$digest();
            });

            it('should call language.change', (done) => {
                users.getCurrent().then(() => {
                    expect(language.change).toHaveBeenCalledWith('en-us');
                    done();
                });
                rootScope.$digest();
            });

            describe('preferences.locale_display set', () => {
                beforeEach(() => {
                    user.preferences.locale_display = 'en-nz';
                });

                it('should call locale.change', (done) => {
                    users.getCurrent().then(() => {
                        expect(locale.change).toHaveBeenCalledWith('en-nz');
                        done();
                    });
                    rootScope.$digest();
                });
            });

            describe('preferences.locale set', () => {
                beforeEach(() => {
                    user.preferences.locale = 'en-nz';
                });

                it('should call language.change', (done) => {
                    users.getCurrent().then(() => {
                        expect(language.change).toHaveBeenCalledWith('en-nz');
                        done();
                    });
                    rootScope.$digest();
                });
            });

            describe('preferences.default_account_list set', () => {
                let spy;

                beforeEach(() => {
                    spy = spyOn(users, 'getKeyAccount').and.callFake(() => q.resolve());
                    spyOn(users, 'getOptions').and.callFake(() => q.resolve());
                });

                describe('promise successful', () => {
                    it('should call accounts.swap with default_account_list', (done) => {
                        users.getCurrent().then(() => {
                            expect(accounts.swap).toHaveBeenCalledWith('account_list_id', 'user_id');
                            done();
                        });
                        rootScope.$digest();
                    });

                    it('should call getOptions', (done) => {
                        users.getCurrent().then(() => {
                            expect(users.getOptions).toHaveBeenCalledWith(true, false);
                            done();
                        });
                        rootScope.$digest();
                    });

                    it('should call getKeyAccount', (done) => {
                        users.getCurrent().then(() => {
                            expect(users.getKeyAccount).toHaveBeenCalled();
                            done();
                        });
                        rootScope.$digest();
                    });
                });

                describe('promise unsuccessful', () => {
                    beforeEach(() => {
                        spy.and.callFake(() => q.reject());
                    });

                    describe('users.currentOptions.setup_position exists', () => {
                        it('should call redirectUserToStart', (done) => {
                            users.getCurrent().catch(() => {
                                expect(users.redirectUserToStart).toHaveBeenCalled();
                                done();
                            });
                            rootScope.$digest();
                        });
                    });

                    describe('users.currentOptions.setup_position does not exist', () => {
                        it('should call redirectUserToStart', (done) => {
                            users.currentOptions = { setup_position: { value: 'connect' } };
                            users.getCurrent().catch(() => {
                                expect(users.redirectUserToStart).not.toHaveBeenCalled();
                                done();
                            });
                            rootScope.$digest();
                        });
                    });
                });
            });

            describe('localStorage.user_id_accountListId set', () => {
                it('should call accounts.swap with localStorage.user_id_accountListId', (done) => {
                    $$window.localStorage.setItem('user_id_accountListId', 'local_storage_account_list_id');
                    users.getCurrent().then(() => {
                        expect(accounts.swap).toHaveBeenCalledWith('local_storage_account_list_id', 'user_id');
                        $$window.localStorage.removeItem('user_id_accountListId');
                        done();
                    });
                    rootScope.$digest();
                });
            });

            describe('no account list set', () => {
                beforeEach(() => {
                    user.preferences = {};
                    spyOn(users, 'getOptions').and.callFake(() => q.resolve());
                });

                it('should call getOptions', (done) => {
                    users.getCurrent().catch(() => {
                        expect(users.getOptions).toHaveBeenCalledWith(true, true);
                        done();
                    });
                    rootScope.$digest();
                });

                it('should call redirectUserToStart', (done) => {
                    users.getCurrent().catch(() => {
                        expect(users.redirectUserToStart).toHaveBeenCalled();
                        done();
                    });
                    rootScope.$digest();
                });
            });

            describe('reset', () => {
                it('should call getOptions', (done) => {
                    spyOn(users, 'getOptions').and.callFake(() => q.resolve());
                    users.getCurrent(true).then(() => {
                        expect(users.getOptions).toHaveBeenCalledWith(true, false);
                        done();
                    });
                    rootScope.$digest();
                });
            });
        });

        describe('cache', () => {
            beforeEach(() => {
                spyOn(users, 'getOptions').and.callFake(() => q.resolve());
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
                expect(users.getCurrent()).toEqual(jasmine.any(q));
            });

            describe('promise successful', () => {
                it('returns users.current', (done) => {
                    users.getCurrent().then((data) => {
                        expect(data).toEqual(users.current);
                        done();
                    });
                    rootScope.$digest();
                });
            });
        });
    });

    describe('redirectUserToStart', () => {
        beforeEach(() => {
            users.current = { id: 'user_id' };
            spyOn(users, 'setOption').and.callFake(() => q.resolve());
        });

        it('should call setOption', () => {
            users.redirectUserToStart();
            expect(users.setOption).toHaveBeenCalledWith({ key: 'setup_position', value: 'start' });
        });

        it('should return promise', () => {
            expect(users.redirectUserToStart()).toEqual(jasmine.any(q));
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

    describe('getCurrentOptionValue', () => {
        it('should return null', () => {
            users.currentOptions = {};
            expect(users.getCurrentOptionValue('a')).toBeUndefined();
        });

        it('should also return null', () => {
            users.currentOptions = {
                a: {}
            };
            expect(users.getCurrentOptionValue('a')).toBeUndefined();
        });

        it('should return value', () => {
            users.currentOptions = {
                a: { value: 1 }
            };
            expect(users.getCurrentOptionValue('a')).toEqual(1);
        });
    });

    describe('deleteOption', () => {
        const key = 'name';
        beforeEach(() => {
            spyOn(api, 'delete').and.callFake(() => q.resolve());
        });

        it('should call api delete', () => {
            users.deleteOption(key);
            expect(api.delete).toHaveBeenCalledWith({
                url: `user/options/${key}`,
                type: 'user_options'
            });
        });

        it('should remove the user option', (done) => {
            users.currentOptions = { [key]: {} };
            users.deleteOption(key).then(() => {
                expect(users.currentOptions).toEqual({});
                done();
            });
            rootScope.$digest();
        });
    });
});
