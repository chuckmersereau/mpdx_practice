import component from './finish.component';

describe('setup.start.component', () => {
    let $ctrl, scope, rootScope, state, setup, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _setup_, $q) => {
            rootScope = $rootScope;
            state = $state;
            setup = _setup_;
            q = $q;
            scope = rootScope.$new();
            $ctrl = $componentController('setupFinish', { $scope: scope });
        });
    });

    describe('$onInit', () => {
        it('should call setPosition', () => {
            spyOn(setup, 'setPosition');
            $ctrl.$onInit();
            expect(setup.setPosition).toHaveBeenCalledWith('finish');
        });
    });

    describe('next', () => {
        beforeEach(() => {
            spyOn(setup, 'setPosition').and.callFake(() => q.resolve());
        });

        it('should call setup.setPosition', () => {
            $ctrl.next();
            expect(setup.setPosition).toHaveBeenCalledWith('');
        });

        it('should return promise', () => {
            expect($ctrl.next()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go');
                $ctrl.next().then(() => {
                    expect(state.go).toHaveBeenCalledWith('tools', { setup: true });
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('dashboard', () => {
        beforeEach(() => {
            spyOn(setup, 'setPosition').and.callFake(() => q.resolve());
        });

        it('should call setup.setPosition', () => {
            $ctrl.dashboard();
            expect(setup.setPosition).toHaveBeenCalledWith('');
        });

        it('should return promise', () => {
            expect($ctrl.dashboard()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go');
                $ctrl.dashboard().then(() => {
                    expect(state.go).toHaveBeenCalledWith('home');
                    done();
                });
                scope.$digest();
            });
        });
    });
});
