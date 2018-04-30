import service from './accounts.service';
import * as moment from 'moment';

describe('common.accounts.service', () => {
    let rootScope, accounts, api, q;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _accounts_, _api_, $q) => {
            rootScope = $rootScope;
            api = _api_;
            api.account_list_id = 234;
            accounts = _accounts_;
            q = $q;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(accounts.analytics).toEqual(null);
            expect(accounts.current).toEqual(null);
            expect(accounts.data).toEqual({});
            expect(accounts.defaultIncludes).toEqual(
                'primary_appeal'
            );
            expect(accounts.defaultFields).toEqual({ primary_appeal: '' });
            expect(accounts.donations).toEqual(null);
            expect(accounts.inviteList).toEqual(null);
            expect(accounts.userList).toEqual(null);
            expect(accounts.currentInitialState).toEqual({});
        });
    });

    describe('get', () => {
        const retVal = { id: 1 };
        it('should get account_list by id', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve(retVal));
            spyOn(accounts, 'setLocalStorage').and.callFake(() => {});
            accounts.get(1).then((data) => {
                expect(api.get).toHaveBeenCalledWith('account_lists/1', {
                    include: accounts.defaultIncludes,
                    fields: accounts.defaultFields
                });
                expect(data).toEqual(retVal);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('swap', () => {
        const retVal = { id: 1 };

        beforeEach(() => {
            accounts.current = { id: 1 };
            spyOn(accounts, 'get').and.callFake(() => q.resolve(retVal));
            spyOn(accounts, 'setLocalStorage').and.callFake(() => {});
        });

        it('should reject on same id', (done) => {
            accounts.swap(1, 2, false).catch(() => {
                expect(accounts.get).not.toHaveBeenCalled();
                done();
            });
            rootScope.$digest();
        });

        it('should reject on undefined id', (done) => {
            accounts.swap().catch(() => {
                expect(accounts.get).not.toHaveBeenCalled();
                done();
            });
            rootScope.$digest();
        });

        it('should call get', (done) => {
            accounts.swap(2).then(() => {
                expect(accounts.get).toHaveBeenCalledWith(2);
                done();
            });
            rootScope.$digest();
        });

        it('should call set localStorage', (done) => {
            accounts.swap(2, 3).then(() => {
                expect(accounts.setLocalStorage).toHaveBeenCalledWith('3_accountListId', '2');
                done();
            });
            rootScope.$digest();
        });

        it('should set currentInitialState', (done) => {
            accounts.swap(2, 3).then(() => {
                expect(accounts.currentInitialState).toEqual(retVal);
                done();
            });
            rootScope.$digest();
        });

        it('should set account_list_id', (done) => {
            accounts.swap(2, 3).then(() => {
                expect(api.account_list_id).toEqual(2);
                done();
            });
            rootScope.$digest();
        });

        it('should set emit accountListUpdated', (done) => {
            spyOn(rootScope, '$emit').and.callThrough();
            accounts.swap(2, 3).then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('accountListUpdated', 2);
                done();
            });
            rootScope.$digest();
        });

        it('should return api value', (done) => {
            accounts.swap(2, 3).then((data) => {
                expect(data).toEqual(retVal);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('getCurrent', () => {
        it('should call swap on current id', () => {
            spyOn(accounts, 'swap').and.callFake(() => q.resolve());
            accounts.getCurrent(3, false);
            expect(accounts.swap).toHaveBeenCalledWith(api.account_list_id, 3, false);
        });
    });

    describe('getDonations', () => {
        const retVal = ['a'];
        it('should call the api', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve(retVal));
            accounts.getDonations();
            expect(api.get).toHaveBeenCalledWith('account_lists/234/donations', {});
        });

        it('should set donations', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve(retVal));
            accounts.getDonations().then(() => {
                expect(accounts.donations).toEqual(retVal);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('getAnalytics', () => {
        const retVal = ['a'];
        const params = {
            endDate: moment('2015-07-05'),
            startDate: moment('2015-07-02')
        };

        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve(retVal));
        });

        it('should call the api', () => {
            accounts.getAnalytics(params, 'a');
            expect(api.get).toHaveBeenCalledWith('account_lists/234/analytics', {
                filter: {
                    date_range: '2015-07-02..2015-07-05'
                }
            }, undefined, 'a');
        });

        it('should set userList', (done) => {
            accounts.getAnalytics(params).then(() => {
                expect(accounts.analytics).toEqual(retVal);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('saveCurrent', () => {
        const account = { id: 1, name: 'a' };
        beforeEach(() => {
            accounts.currentInitialState = account;
        });

        it('shouldn\'t call the api if no changes', (done) => {
            accounts.current = account;
            spyOn(api, 'put').and.callFake(() => q.resolve());
            accounts.saveCurrent().then((data) => {
                expect(api.put).not.toHaveBeenCalled();
                expect(data).toEqual(account);
                done();
            });
            rootScope.$digest();
        });

        it('should call the api with a patch', (done) => {
            accounts.current = { id: 1, name: 'a', prop: 'b' };
            spyOn(api, 'put').and.callFake(() => q.resolve());
            spyOn(accounts, 'get').and.callFake(() => q.resolve({ id: 1 }));
            accounts.saveCurrent('a', 'b').then(() => {
                expect(api.put).toHaveBeenCalledWith('account_lists/1', { id: 1, prop: 'b' }, 'a', 'b');
                done();
            });
            rootScope.$digest();
        });

        it('should re-get the account_list from the api once successful', (done) => {
            accounts.current = { id: 1, name: 'a', prop: 'b' };
            spyOn(api, 'put').and.callFake(() => q.resolve());
            spyOn(accounts, 'get').and.callFake(() => q.resolve({ id: 1 }));
            accounts.saveCurrent().then(() => {
                expect(accounts.get).toHaveBeenCalledWith(1);
                done();
            });
            rootScope.$digest();
        });

        it('should set currentInitialState', (done) => {
            accounts.current = { id: 1, name: 'a', prop: 'b' };
            spyOn(api, 'put').and.callFake(() => q.resolve());
            spyOn(accounts, 'get').and.callFake(() => q.resolve({ id: 1 }));
            accounts.saveCurrent().then((data) => {
                expect(accounts.currentInitialState).toEqual({ id: 1 });
                done();
            });
            rootScope.$digest();
        });
    });

    describe('listInvites', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'get').and.callFake(() => q.resolve([]));
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
            expect(accounts.listInvites()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should set inviteList', (done) => {
                accounts.inviteList = null;
                accounts.listInvites().then(() => {
                    expect(accounts.inviteList).toEqual([]);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('listUsers', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'get').and.callFake(() => q.resolve([]));
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
            expect(accounts.listUsers()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should set userList', (done) => {
                accounts.userList = null;
                accounts.listUsers().then(() => {
                    expect(accounts.userList).toEqual([]);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('destroyUser', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'delete').and.callFake(() => q.resolve([]));
        });

        it('should call the api', () => {
            accounts.destroyUser(123, 'a', 'b');
            expect(api.delete).toHaveBeenCalledWith(
                'account_lists/123/users/123',
                undefined, 'a', 'b'
            );
        });

        it('should return promise', () => {
            expect(accounts.destroyUser(123)).toEqual(jasmine.any(q));
        });
    });

    describe('listCoachesInvites', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'get').and.callFake(() => q.resolve([]));
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
            expect(accounts.listCoachesInvites()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should set inviteCoachList', (done) => {
                accounts.inviteCoachList = null;
                accounts.listCoachesInvites().then(() => {
                    expect(accounts.inviteCoachList).toEqual([]);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('listCoaches', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'get').and.callFake(() => q.resolve([]));
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
            expect(accounts.listCoaches()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should set coachList', (done) => {
                accounts.coachList = null;
                accounts.listCoaches().then(() => {
                    expect(accounts.coachList).toEqual([]);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('destroyCoach', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'delete').and.callFake(() => q.resolve([]));
        });

        it('should call the api', () => {
            accounts.destroyCoach(123, 'a', 'b');
            expect(api.delete).toHaveBeenCalledWith({
                url: 'account_lists/123/coaches/123',
                successMessage: 'a',
                errorMessage: 'b'
            });
        });

        it('should return promise', () => {
            expect(accounts.destroyCoach(123)).toEqual(jasmine.any(q));
        });
    });

    describe('destroyInvite', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'delete').and.callFake(() => q.resolve([]));
        });

        it('should call the api', () => {
            accounts.destroyInvite(123, 'a', 'b');
            expect(api.delete).toHaveBeenCalledWith({
                url: 'account_lists/123/invites/123',
                type: 'account_list_invites',
                successMessage: 'a',
                errorMessage: 'b'
            });
        });

        it('should return promise', () => {
            expect(accounts.destroyInvite(123)).toEqual(jasmine.any(q));
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve([{ id: 2 }]));
        });
        it('shouldn\'t call api unless reset', (done) => {
            accounts.data = [{ id: 1 }];
            accounts.load().then(() => {
                expect(api.get).not.toHaveBeenCalled();
                expect(accounts.data).toEqual([{ id: 1 }]);
                done();
            });
            rootScope.$digest();
        });
        it('should call api', (done) => {
            accounts.data = [];
            accounts.load().then(() => {
                expect(api.get).toHaveBeenCalledWith('account_lists', {
                    include: accounts.defaultIncludes,
                    fields: accounts.defaultFields
                });
                expect(accounts.data).toEqual([{ id: 2 }]);
                done();
            });
            rootScope.$digest();
        });
    });
});
