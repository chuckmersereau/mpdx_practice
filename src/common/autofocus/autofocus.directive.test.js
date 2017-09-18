import directive from './autofocus.directive';

describe('common.autofocus.directive', () => {
    let element, $compile, rootScope;
    beforeEach(() => {
        angular.mock.module(directive);
        inject((_$compile_, $rootScope) => {
            rootScope = $rootScope;
            $compile = _$compile_;
            element = $compile('<input autofocus="true">')(rootScope);
        });
    });
    xit('should have focus', () => {
        expect(document.activeElement).toEqual(element); // dummy for linting
    });
});