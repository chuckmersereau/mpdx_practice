import service from './monthRange.service';

describe('common.help.service', () => {
    let monthRange, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _monthRange_) => {
            rootScope = $rootScope;
            monthRange = _monthRange_;
        });
    });
    xit('should do something', () => {
        expect(monthRange).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
