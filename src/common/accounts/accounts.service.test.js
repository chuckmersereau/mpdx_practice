import service from './accounts.service';

describe('common.accounts.service', () => {
    let accounts, api;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _accounts_, _api_) => {
            accounts = _accounts_;
            api = _api_;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(accounts.analytics).toEqual(null);
            expect(accounts.current).toEqual(null);
            expect(accounts.data).toEqual({});
            expect(accounts.defaultIncludes).toEqual(
                'notification_preferences,notification_preferences.notification_type'
            );
            expect(accounts.donations).toEqual(null);
            expect(accounts.inviteList).toEqual(null);
            expect(accounts.userList).toEqual(null);
            expect(accounts.currentInitialState).toEqual({});
        });
    });

    describe('listInvites', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'get').and.callFake(() => Promise.resolve([]));
        });

        it('should set inviteCoachList to null', () => {
            accounts.inviteList = [];
            accounts.listInvites();
            expect(accounts.inviteList).toEqual(null);
        });

        it('should call the api', () => {
            accounts.listInvites();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/123/invites', {
                    include: 'invited_by_user',
                    fields: {
                        contacts: 'first_name, last_name'
                    },
                    filter: {
                        invite_user_as: 'user'
                    }
                }
            );
        });

        it('should return promise', () => {
            expect(accounts.listInvites()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set inviteList', (done) => {
                accounts.inviteList = null;
                accounts.listInvites().then(() => {
                    expect(accounts.inviteList).toEqual([]);
                    done();
                });
            });
        });
    });

    describe('listUsers', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'get').and.callFake(() => Promise.resolve([]));
        });

        it('should set userList to null', () => {
            accounts.userList = [];
            accounts.listUsers();
            expect(accounts.userList).toEqual(null);
        });

        it('should call the api', () => {
            accounts.listCoaches();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/123/coaches', {
                    include: 'email_addresses',
                    fields: {
                        email_addresses: 'email,primary',
                        users: 'email_addresses,first_name,last_name'
                    }
                }
            );
        });

        it('should return promise', () => {
            expect(accounts.listUsers()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set userList', (done) => {
                accounts.userList = null;
                accounts.listUsers().then(() => {
                    expect(accounts.userList).toEqual([]);
                    done();
                });
            });
        });
    });

    describe('destroyCoach', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'delete').and.callFake(() => Promise.resolve([]));
        });

        it('should call the api', () => {
            accounts.destroyCoach(123);
            expect(api.delete).toHaveBeenCalledWith(
                'account_lists/123/coaches/123'
            );
        });

        it('should return promise', () => {
            expect(accounts.destroyCoach(123)).toEqual(jasmine.any(Promise));
        });
    });

    describe('listCoachesInvites', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'get').and.callFake(() => Promise.resolve([]));
        });

        it('should set inviteCoachList to null', () => {
            accounts.inviteCoachList = [];
            accounts.listCoachesInvites();
            expect(accounts.inviteCoachList).toEqual(null);
        });

        it('should call the api', () => {
            accounts.listCoachesInvites();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/123/invites', {
                    include: 'invited_by_user',
                    fields: {
                        contacts: 'first_name, last_name'
                    },
                    filter: {
                        invite_user_as: 'coach'
                    }
                }
            );
        });

        it('should return promise', () => {
            expect(accounts.listCoachesInvites()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set inviteCoachList', (done) => {
                accounts.inviteCoachList = null;
                accounts.listCoachesInvites().then(() => {
                    expect(accounts.inviteCoachList).toEqual([]);
                    done();
                });
            });
        });
    });

    describe('listCoaches', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'get').and.callFake(() => Promise.resolve([]));
        });

        it('should set coachList to null', () => {
            accounts.coachList = [];
            accounts.listCoaches();
            expect(accounts.coachList).toEqual(null);
        });

        it('should call the api', () => {
            accounts.listCoaches();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/123/coaches', {
                    include: 'email_addresses',
                    fields: {
                        email_addresses: 'email,primary',
                        users: 'email_addresses,first_name,last_name'
                    }
                }
            );
        });

        it('should return promise', () => {
            expect(accounts.listCoaches()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set coachList', (done) => {
                accounts.coachList = null;
                accounts.listCoaches().then(() => {
                    expect(accounts.coachList).toEqual([]);
                    done();
                });
            });
        });
    });

    describe('destroyCoach', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'delete').and.callFake(() => Promise.resolve([]));
        });

        it('should call the api', () => {
            accounts.destroyCoach(123);
            expect(api.delete).toHaveBeenCalledWith(
                'account_lists/123/coaches/123'
            );
        });

        it('should return promise', () => {
            expect(accounts.destroyCoach(123)).toEqual(jasmine.any(Promise));
        });
    });

    describe('destroyInvite', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'delete').and.callFake(() => Promise.resolve([]));
        });

        it('should call the api', () => {
            accounts.destroyInvite(123);
            expect(api.delete).toHaveBeenCalledWith({
                url: 'account_lists/123/invites/123',
                type: 'account_list_invites'
            });
        });

        it('should return promise', () => {
            expect(accounts.destroyInvite(123)).toEqual(jasmine.any(Promise));
        });
    });
});
