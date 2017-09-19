import service from './cover.service';

describe('common.cover.service', () => {
    let cover, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _cover_) => {
            rootScope = $rootScope;
            cover = _cover_;
        });
    });
    xit('should do something', () => {
        expect(cover).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
