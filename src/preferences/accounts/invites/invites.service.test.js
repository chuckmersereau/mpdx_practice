import service from './invites.service';

describe('preferences.coaches.invites.service', () => {
    let invites, api;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _invites_) => {
            invites = _invites_;
            api = _api_;
        });
    });

    describe('create', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'post').and.callFake(() => Promise.resolve([]));
        });

        it('should call the api', () => {
            invites.create('test@example.com');
            expect(api.post).toHaveBeenCalledWith({
                url: 'account_lists/123/invites',
                data: { recipient_email: 'test@example.com', invite_user_as: 'user' },
                type: 'account_list_invites'
            });
        });

        it('should return promise', () => {
            expect(invites.create('test@example.com')).toEqual(jasmine.any(Promise));
        });
    });
});
