import component from './finish.component';

describe('setup.start.component', () => {
    let $ctrl, componentController, scope, rootScope, state, setup;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _setup_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            state = $state;
            setup = _setup_;
            scope = rootScope.$new();
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('setupFinish', { $scope: scope });
    }

    describe('$onInit', () => {
        it('should call setPosition', () => {
            spyOn(setup, 'setPosition');
            $ctrl.$onInit();
            expect(setup.setPosition).toHaveBeenCalledWith('finish');
        });
    });

    describe('next', () => {
        beforeEach(() => {
            spyOn(setup, 'setPosition').and.callFake(() => Promise.resolve());
        });

        it('should call setup.setPosition', () => {
            $ctrl.next();
            expect(setup.setPosition).toHaveBeenCalledWith('');
        });

        it('should return promise', () => {
            expect($ctrl.next()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go');
                $ctrl.next().then(() => {
                    expect(state.go).toHaveBeenCalledWith('tools', { setup: true });
                    done();
                });
            });
        });
    });

    describe('dashboard', () => {
        beforeEach(() => {
            spyOn(setup, 'setPosition').and.callFake(() => Promise.resolve());
        });

        it('should call setup.setPosition', () => {
            $ctrl.dashboard();
            expect(setup.setPosition).toHaveBeenCalledWith('');
        });

        it('should return promise', () => {
            expect($ctrl.dashboard()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go');
                $ctrl.dashboard().then(() => {
                    expect(state.go).toHaveBeenCalledWith('home');
                    done();
                });
            });
        });
    });
});
