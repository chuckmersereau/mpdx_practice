import directive from './convertToNumber.directive';

describe('common.convertToNumber.directive', () => {
    let element, $compile, rootScope;
    beforeEach(() => {
        angular.mock.module(directive);
        inject((_$compile_, $rootScope) => {
            rootScope = $rootScope;
            rootScope.val = '1';
            $compile = _$compile_;
            element = $compile('<input convert-to-number ng-model="val">')(rootScope);
        });
    });
    xit('should convert element to number', () => {
        expect(element.value).toEqual(1);
    });
});