import component from './mobile.component';
import bowser from 'bowser';

describe('mobile.component', () => {
    let $ctrl, componentController, scope, rootScope;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('mobile', { $scope: scope });
    }

    describe('$onInit', () => {
        beforeEach(() => {
            bowser.android = false;
            bowser.ios = false;
        });

        afterEach(() => {
            bowser.android = false;
            bowser.ios = false;
        });

        it('should set default values', () => {
            $ctrl.$onInit();
            expect($ctrl.isIos).toEqual(false);
            expect($ctrl.isAndroid).toEqual(false);
            expect($ctrl.isMobile).toEqual(false);
        });

        describe('android', () => {
            beforeEach(() => {
                bowser.android = true;
            });

            afterEach(() => {
                bowser.android = true;
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
                bowser.ios = true;
            });

            afterEach(() => {
                bowser.ios = true;
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
