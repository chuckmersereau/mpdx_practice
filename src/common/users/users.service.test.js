import service from './users.service';

describe('common.users.service', () => {
    let users, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _users_) => {
            rootScope = $rootScope;
            users = _users_;
        });
    });
    xit('should do something', () => {
        expect(users).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
