import directive from './bgImg.directive';

describe('common.bgImg.directive', () => {
    let element, $compile, rootScope;
    beforeEach(() => {
        angular.mock.module(directive);
        inject((_$compile_, $rootScope) => {
            rootScope = $rootScope;
            $compile = _$compile_;
            element = $compile('<div bg-img="1"></div>')(rootScope);
        });
    });
    it('should set the background image', () => {
        rootScope.$digest();
        expect(/^url\(\S+1\)$/.test(element.css('background-image'))).toEqual(true);
    });
});