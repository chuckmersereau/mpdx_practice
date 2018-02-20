import component from './resetAccount.component';

describe('preferences.admin.resetAccount.component', () => {
    let $ctrl, componentController, scope, rootScope, gettextCatalog, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _api_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            gettextCatalog = _gettextCatalog_;
            api = _api_;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('preferencesAdminResetAccount', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.resetAccount).toEqual({ resetted_user_email: '', reason: '', account_list_name: '' });
            expect($ctrl.saving).toEqual(false);
        });
    });

    describe('save', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.resetAccount = { resetted_user_email: 'abc@email.com', reason: 'hello', account_list_name: 'Staff Account' };
        });

        it('should set saving to true', () => {
            $ctrl.save();
            expect($ctrl.saving).toEqual(true);
        });

        it('should call the api', () => {
            const successMessage = 'Successfully reset account';
            const errorMessage = 'Unable to reset account';
            $ctrl.save();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(api.post).toHaveBeenCalledWith({
                url: 'admin/resets',
                data: { resetted_user_email: 'abc@email.com', reason: 'hello', account_list_name: 'Staff Account' },
                type: 'resets',
                successMessage: successMessage,
                errorMessage: errorMessage
            });
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set saving to false', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.saving).toEqual(false);
                    done();
                });
            });

            it('should reset resetAccount', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.resetAccount).toEqual({ resetted_user_email: '', reason: '', account_list_name: '' });
                    done();
                });
            });

            it('should reset form', (done) => {
                let form = {
                    $setUntouched: () => {},
                    $setPristine: () => {}
                };

                spyOn(form, '$setUntouched').and.callThrough();
                spyOn(form, '$setPristine').and.callThrough();

                $ctrl.save(form).then(() => {
                    expect(form.$setUntouched).toHaveBeenCalled();
                    expect(form.$setPristine).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => Promise.reject());
            });

            it('should set saving to false', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.saving).toEqual(false);
                    done();
                });
            });
        });
    });
});
