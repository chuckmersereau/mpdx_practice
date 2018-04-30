import * as bowser from 'bowser';
import component from './root.component';

describe('root.component', () => {
    let $ctrl, state, componentController, scope, rootScope, session, $$window;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($window, $state, $componentController, $rootScope, _session_) => {
            state = $state;
            $$window = $window;
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            session = _session_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('root', { $scope: scope });
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.session).toEqual(session);
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($$window.localStorage, 'setItem').and.callFake(() => {});
        });

        it('should not call state.go', () => {
            spyOn(state, 'go').and.callFake(() => {});
            $ctrl.$onInit();
            expect(state.go).not.toHaveBeenCalledWith('mobile');
        });

        describe('browser is android', () => {
            let spy;

            beforeEach(() => {
                spy = spyOn($$window.localStorage, 'getItem').and.callFake(() => {});
                (bowser as any).android = true;
            });

            afterEach(() => {
                (bowser as any).android = false;
            });

            it('should call state.go', () => {
                spyOn(state, 'go').and.callFake(() => {});
                $ctrl.$onInit();
                expect(state.go).toHaveBeenCalledWith('mobile');
            });

            it('should call localStorage.setItem', () => {
                $ctrl.$onInit();
                expect($$window.localStorage.setItem).toHaveBeenCalledWith('hide_mobile', 'true');
            });

            describe('browser hide_mobile == true', () => {
                beforeEach(() => {
                    spy.and.returnValue('true');
                    (bowser as any).android = true;
                });

                it('should not call state.go', () => {
                    spyOn(state, 'go').and.callFake(() =>{ });
                    $ctrl.$onInit();
                    expect(state.go).not.toHaveBeenCalledWith('mobile');
                });

                it('should not call localStorage.setItem', () => {
                    $ctrl.$onInit();
                    expect($$window.localStorage.setItem).not.toHaveBeenCalledWith('hide_mobile', 'true');
                });
            });
        });

        describe('browser is ios', () => {
            let spy;

            beforeEach(() => {
                spy = spyOn($$window.localStorage, 'getItem').and.callFake(() =>{});
                (bowser as any).ios = true;
            });

            afterEach(() => {
                (bowser as any).ios = false;
            });

            it('should call state.go', () => {
                spyOn(state, 'go').and.callFake(() => {});
                $ctrl.$onInit();
                expect(state.go).toHaveBeenCalledWith('mobile');
            });

            it('should call localStorage.setItem', () => {
                $ctrl.$onInit();
                expect($$window.localStorage.setItem).toHaveBeenCalledWith('hide_mobile', 'true');
            });

            describe('browser hide_mobile == true', () => {
                beforeEach(() => {
                    spy.and.returnValue('true');
                    (bowser as any).android = true;
                });

                it('should not call state.go', () => {
                    spyOn(state, 'go').and.callFake(() => {});
                    $ctrl.$onInit();
                    expect(state.go).not.toHaveBeenCalledWith('mobile');
                });

                it('should not call localStorage.setItem', () => {
                    $ctrl.$onInit();
                    expect($$window.localStorage.setItem).not.toHaveBeenCalledWith('hide_mobile', 'true');
                });
            });
        });
    });
});
