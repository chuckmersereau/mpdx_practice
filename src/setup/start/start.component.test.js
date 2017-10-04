import component from './start.component';

describe('setup.start.component', () => {
    let $ctrl, componentController, scope, rootScope, setup;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _setup_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            setup = _setup_;
            scope = rootScope.$new();
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('setupStart', { $scope: scope });
    }

    describe('$onInit', () => {
        it('should call setup.setPosition', () => {
            spyOn(setup, 'setPosition');
            $ctrl.$onInit();
            expect(setup.setPosition).toHaveBeenCalledWith('start');
        });
    });

    describe('next', () => {
        beforeEach(() => {
            spyOn(setup, 'next').and.callFake(() => Promise.resolve());
        });

        it('should call setup.next', () => {
            $ctrl.next();
            expect(setup.next).toHaveBeenCalled();
        });

        it('should set saving to true', () => {
            $ctrl.saving = false;
            $ctrl.next();
            expect($ctrl.saving).toEqual(true);
        });

        it('should return a promise', () => {
            expect($ctrl.next()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set saving to false', (done) => {
                $ctrl.saving = true;
                $ctrl.next().then(() => {
                    expect($ctrl.saving).toEqual(false);
                    done();
                });
            });
        });
    });
});
