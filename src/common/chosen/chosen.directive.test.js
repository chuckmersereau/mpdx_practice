import directive from './chosen.directive';

describe('common.chosen.directive', () => {
    let element, $compile, rootScope;
    beforeEach(() => {
        angular.mock.module(directive);
        inject((_$compile_, $rootScope) => {
            rootScope = $rootScope;
            $compile = _$compile_;
            element = $compile('<input chosen>')(rootScope);
        });
    });
    xit('should fix the chosen list when defined', () => {
        expect(element).toBeDefined(); // dummy for linting
    });
});