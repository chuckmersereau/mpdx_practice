import component from './avatar.component';

describe('common.avatar.component', () => {
    let $ctrl, rootScope, scope, componentController, alerts, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _alerts_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            alerts = _alerts_;
            q = $q;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('avatar', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should have default values', () => {
            expect($ctrl.loading).toEqual(false);
        });
    });

    describe('upload', () => {
        let spy, form;

        beforeEach(() => {
            form = {};
            $ctrl.avatar = { id: 'avatar_id' };
            $ctrl.onUpload = () => {};
            spy = spyOn($ctrl, 'onUpload').and.callFake(() => q.resolve(
                { data: { data: { attributes: { avatar: 'src_link' } } } }
            ));
        });

        describe('form is valid', () => {
            beforeEach(() => {
                spyOn($ctrl, 'valid').and.returnValue(true);
            });

            it('should set loading true', () => {
                $ctrl.upload(form);
                expect($ctrl.loading).toEqual(true);
            });

            it('should call onUpload', () => {
                $ctrl.upload(form);
                expect($ctrl.onUpload).toHaveBeenCalledWith(
                    { avatar: { id: 'avatar_id' } }
                );
            });

            it('should return promise', () => {
                expect($ctrl.upload(form)).toEqual(jasmine.any(q));
            });

            describe('promise successful', () => {
                beforeEach(() => {
                    spyOn(alerts, 'addAlert');
                });

                it('should set loading false', (done) => {
                    $ctrl.upload(form).then(() => {
                        expect($ctrl.loading).toEqual(false);
                        done();
                    });
                    rootScope.$digest();
                });

                it('should set src to avatar url', (done) => {
                    $ctrl.upload(form).then(() => {
                        expect($ctrl.src).toEqual('src_link');
                        done();
                    });
                    rootScope.$digest();
                });

                it('should call alerts.addAlert', (done) => {
                    $ctrl.upload(form).then(() => {
                        expect(alerts.addAlert).toHaveBeenCalledWith(
                            'Avatar uploaded successfully'
                        );
                        done();
                    });
                    rootScope.$digest();
                });
            });

            describe('promise unsuccessful', () => {
                beforeEach(() => {
                    spy.and.callFake(() => q.reject({}));
                });

                it('should set loading false', (done) => {
                    $ctrl.upload(form).catch(() => {
                        expect($ctrl.loading).toEqual(false);
                        done();
                    });
                    rootScope.$digest();
                });
            });
        });
    });

    describe('valid', () => {
        let form;

        describe('form is valid', () => {
            beforeEach(() => {
                $ctrl.avatar = {};
                form = { $valid: true };
            });

            it('should return true', () => {
                expect($ctrl.valid(form)).toEqual(true);
            });
        });

        describe('form is invalid', () => {
            beforeEach(() => {
                $ctrl.avatar = {};
                form = { $valid: false, avatar: { $error: {} } };
                spyOn(alerts, 'addAlert');
            });

            it('should return false', () => {
                expect($ctrl.valid(form)).toEqual(false);
            });

            it('should set avatar to null', () => {
                $ctrl.avatar = {};
                $ctrl.valid(form);
                expect($ctrl.avatar).toEqual(null);
            });

            describe('minWidth && minHeight is invalid', () => {
                beforeEach(() => {
                    form.avatar.$error.minWidth = true;
                    form.avatar.$error.minHeight = true;
                });

                it('should call alerts.addAlert', () => {
                    $ctrl.valid(form);
                    expect(alerts.addAlert).toHaveBeenCalledWith(
                        'Avatar dimesions must be at least 320px x 320px',
                        'danger'
                    );
                });
            });

            describe('minWidth is invalid', () => {
                beforeEach(() => {
                    form.avatar.$error.minWidth = true;
                });

                it('should call alerts.addAlert', () => {
                    $ctrl.valid(form);
                    expect(alerts.addAlert).toHaveBeenCalledWith(
                        'Avatar width must be at least 320px',
                        'danger'
                    );
                });
            });

            describe('minHeight is invalid', () => {
                beforeEach(() => {
                    form.avatar.$error.minHeight = true;
                });

                it('should call alerts.addAlert', () => {
                    $ctrl.valid(form);
                    expect(alerts.addAlert).toHaveBeenCalledWith(
                        'Avatar height must be at least 320px',
                        'danger'
                    );
                });
            });

            describe('pattern is invalid', () => {
                beforeEach(() => {
                    form.avatar.$error.pattern = true;
                });

                it('should call alerts.addAlert', () => {
                    $ctrl.valid(form);
                    expect(alerts.addAlert).toHaveBeenCalledWith(
                        'Avatar must be a jpeg image file',
                        'danger'
                    );
                });
            });
        });
    });
});
