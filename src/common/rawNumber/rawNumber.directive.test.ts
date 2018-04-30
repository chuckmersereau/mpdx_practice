import directive from './rawNumber.directive';

describe('common.rawNumber.directive', () => {
    let element, $compile, rootScope;
    beforeEach(() => {
        angular.mock.module(directive);
        inject((_$compile_, $rootScope) => {
            rootScope = $rootScope;
            $compile = _$compile_;
            element = $compile('<div raw-number=""></div>')(rootScope);
        });
    });
    xit('should do something', () => {
        expect(element).toEqual(1);
    });
});