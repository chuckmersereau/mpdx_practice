import directive from './chosen.directive';

describe('common.chosen.directive', () => {
    let $compile, rootScope;
    beforeEach(() => {
        angular.mock.module(directive);
        inject((_$compile_, $rootScope) => {
            rootScope = $rootScope;
            $compile = _$compile_;
            $compile('<select chosen><option>b</option><option value="1">a</option></select>')(rootScope);
        });
    });
    it('should fix the chosen list when defined', () => {
        const elm = angular.element('<select chosen><option>b</option><option value="1">a</option></select>');
        rootScope.$digest();
        $compile(elm)(rootScope);
    });
});