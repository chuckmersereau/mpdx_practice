import component from './start.component';

describe('setup.start.component', () => {
    let $ctrl, scope, rootScope, setup, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _setup_, $q) => {
            rootScope = $rootScope;
            setup = _setup_;
            q = $q;
            scope = rootScope.$new();
            $ctrl = $componentController('setupStart', { $scope: scope });
        });
    });

    describe('$onInit', () => {
        it('should call setup.setPosition', () => {
            spyOn(setup, 'setPosition');
            $ctrl.$onInit();
            expect(setup.setPosition).toHaveBeenCalledWith('start');
        });
    });

    describe('next', () => {
        beforeEach(() => {
            spyOn(setup, 'next').and.callFake(() => q.resolve());
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
            expect($ctrl.next()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should set saving to false', (done) => {
                $ctrl.saving = true;
                $ctrl.next().then(() => {
                    expect($ctrl.saving).toEqual(false);
                    done();
                });
                scope.$digest();
            });
        });
    });
});
