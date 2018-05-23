import * as bowser from 'bowser';
import component from './mobile.component';

describe('mobile.component', () => {
    let $ctrl, scope, rootScope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('mobile', { $scope: scope });
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            (bowser as any).android = false;
            (bowser as any).ios = false;
        });

        afterEach(() => {
            (bowser as any).android = false;
            (bowser as any).ios = false;
        });

        it('should set default values', () => {
            $ctrl.$onInit();
            expect($ctrl.isIos).toEqual(false);
            expect($ctrl.isAndroid).toEqual(false);
            expect($ctrl.isMobile).toEqual(false);
        });

        describe('android', () => {
            beforeEach(() => {
                (bowser as any).android = true;
            });

            afterEach(() => {
                (bowser as any).android = true;
            });

            it('should set default values', () => {
                $ctrl.$onInit();
                expect($ctrl.isIos).toEqual(false);
                expect($ctrl.isAndroid).toEqual(true);
                expect($ctrl.isMobile).toEqual(true);
            });
        });

        describe('ios', () => {
            beforeEach(() => {
                (bowser as any).ios = true;
            });

            afterEach(() => {
                (bowser as any).ios = true;
            });

            it('should set default values', () => {
                $ctrl.$onInit();
                expect($ctrl.isIos).toEqual(true);
                expect($ctrl.isAndroid).toEqual(false);
                expect($ctrl.isMobile).toEqual(true);
            });
        });
    });
});
