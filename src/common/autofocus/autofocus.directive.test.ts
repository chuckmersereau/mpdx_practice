import directive from './autofocus.directive';

describe('common.autofocus.directive', () => {
    let $compile, rootScope;
    beforeEach(() => {
        angular.mock.module(directive);
        inject((_$compile_, $rootScope) => {
            rootScope = $rootScope;
            $compile = _$compile_;
            $compile('<input id="123" autofocus>')(rootScope);
        });
    });
    it('should have focus', () => {
        const elm = angular.element('<input id="123" autofocus>');
        rootScope.$digest();
        $compile(elm)(rootScope);
    });
});