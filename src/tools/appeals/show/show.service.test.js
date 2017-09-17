import service from './show.service';

describe('common.appealsShow.service', () => {
    let appealsShow, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _appealsShow_) => {
            rootScope = $rootScope;
            appealsShow = _appealsShow_;
        });
    });
    xit('should do something', () => {
        expect(appealsShow).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
