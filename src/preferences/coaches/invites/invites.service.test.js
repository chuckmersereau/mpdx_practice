import service from './invites.service';

describe('preferences.coaches.invites.service', () => {
    let coachesInvites, api;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _coachesInvites_) => {
            coachesInvites = _coachesInvites_;
            api = _api_;
        });
    });

    describe('create', () => {
        beforeEach(() => {
            api.account_list_id = 123;
            spyOn(api, 'post').and.callFake(() => Promise.resolve([]));
        });

        it('should call the api', () => {
            coachesInvites.create('test@example.com');
            expect(api.post).toHaveBeenCalledWith({
                url: 'account_lists/123/invites',
                data: { recipient_email: 'test@example.com', invite_user_as: 'coach' },
                type: 'account_list_invites'
            });
        });

        it('should return promise', () => {
            expect(coachesInvites.create('test@example.com')).toEqual(jasmine.any(Promise));
        });
    });
});
