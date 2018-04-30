import component from './csv.component';

describe('tools.import.csv.component', () => {
    let $ctrl, rootScope, scope, componentController, transitions, state, importCsv, modal, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $transitions, $state, _importCsv_, _modal_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            transitions = $transitions;
            state = $state;
            importCsv = _importCsv_;
            modal = _modal_;
            q = $q;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('importCsv', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.deregisterTransitionHook).toEqual(null);
        });
    });

    describe('$onInit', () => {
        describe('current route is base route', () => {
            beforeEach(() => {
                state.$current.name = 'tools.import.csv';
            });

            it('should call $state.go', () => {
                spyOn(state, 'go').and.callFake(() => {});
                $ctrl.$onInit();
                expect(state.go).toHaveBeenCalledWith('tools.import.csv.upload');
            });
        });

        it('should set $window.onbeforeunload', () => {
            let e: any = {};
            $ctrl.$onInit();
            expect($ctrl.$window.onbeforeunload(e)).toEqual(
                'Are you sure you want to navigate away from this CSV Import? You will lose all unsaved progress.'
            );

            expect(e.returnValue).toEqual(
                'Are you sure you want to navigate away from this CSV Import? You will lose all unsaved progress.'
            );
        });

        it('should set deregisterTransitionHook', () => {
            $ctrl.deregisterTransitionHook = null;
            $ctrl.$onInit();
            expect($ctrl.deregisterTransitionHook).toEqual(jasmine.any(Function));
        });

        it('should call $transitions.onBefore', () => {
            spyOn(transitions, 'onBefore').and.callFake((data, fn) => [data, fn]);
            $ctrl.$onInit();
            expect(transitions.onBefore).toHaveBeenCalledWith(
                {
                    from: 'tools.import.csv.**',
                    to: jasmine.any(Function)
                },
                jasmine.any(Function)
            );
        });

        describe('$transitions.onBefore callbacks', () => {
            let callbacks;

            beforeEach(() => {
                spyOn(transitions, 'onBefore').and.callFake((data, success) => {
                    return { conditions: data, success: success };
                });
                $ctrl.$onInit();
                callbacks = $ctrl.deregisterTransitionHook;
            });

            describe('to function', () => {
                describe('route includes tools.import.csv', () => {
                    it('should return false', () => {
                        expect(callbacks.conditions.to({ name: 'tools.import.csv.upload' })).toBeFalsy();
                    });
                });

                describe('route does not include tools.import.csv', () => {
                    it('should return false', () => {
                        expect(callbacks.conditions.to({ name: 'contacts.show' })).toBeTruthy();
                    });
                });
            });

            describe('success function', () => {
                describe('importCsv data is empty', () => {
                    it('should return true', () => {
                        expect(callbacks.success()).toBeTruthy();
                    });
                });

                describe('importCsv data is not empty', () => {
                    beforeEach(() => {
                        spyOn(modal, 'confirm').and.callFake(() => q.resolve());
                        importCsv.data = {};
                    });

                    it('should return promise', () => {
                        expect(callbacks.success()).toEqual(jasmine.any(q));
                    });

                    it('should call modal.confirm', () => {
                        callbacks.success();
                        expect(modal.confirm).toHaveBeenCalledWith(
                            'Are you sure you want to navigate away from this CSV Import? You will lose all unsaved progress.'
                        );
                    });
                });
            });
        });
    });

    describe('$onDestroy', () => {
        it('should reset onbeforeunload function', () => {
            $ctrl.$window.onbeforeunload = () => {};
            $ctrl.$onDestroy();
            expect($ctrl.$window.onbeforeunload).toEqual(null);
        });

        it('should call deregisterTransitionHook function', () => {
            $ctrl.deregisterTransitionHook = () => {};
            spyOn($ctrl, 'deregisterTransitionHook').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.deregisterTransitionHook).toHaveBeenCalled();
        });
    });
});