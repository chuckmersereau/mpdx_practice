import service from './invites.service';

describe('preferences.coaches.invites.service', () => {
    let invites, api, q;

    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _invites_, $q) => {
            invites = _invites_;
            api = _api_;
            q = $q;
        });
    });

    describe('create', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'post').and.callFake(() => q.resolve([]));
        });

        it('should call the api', () => {
            invites.create('test@example.com', 'a', 'b');
            expect(api.post).toHaveBeenCalledWith({
                url: 'account_lists/123/invites',
                data: { recipient_email: 'test@example.com', invite_user_as: 'user' },
                type: 'account_list_invites',
                successMessage: 'a',
                errorMessage: 'b'
            });
        });

        it('should return promise', () => {
            expect(invites.create('test@example.com')).toEqual(jasmine.any(q));
        });
    });
});
