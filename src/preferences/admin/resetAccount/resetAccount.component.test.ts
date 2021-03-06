import component from './resetAccount.component';

describe('preferences.admin.resetAccount.component', () => {
    let $ctrl, scope, rootScope, gettextCatalog, api, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _api_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            api = _api_;
            q = $q;
            $ctrl = $componentController('preferencesAdminResetAccount', { $scope: scope }, {});
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.resetAccount).toEqual({ resetted_user_email: '', reason: '', account_list_name: '' });
            expect($ctrl.saving).toEqual(false);
        });
    });

    describe('save', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(api, 'post').and.callFake(() => q.resolve());
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
            expect($ctrl.save()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should set saving to false', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.saving).toEqual(false);
                    done();
                });
                scope.$digest();
            });

            it('should reset resetAccount', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.resetAccount).toEqual({ resetted_user_email: '', reason: '', account_list_name: '' });
                    done();
                });
                scope.$digest();
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
                scope.$digest();
            });
        });

        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => q.reject());
            });

            it('should set saving to false', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.saving).toEqual(false);
                    done();
                });
                scope.$digest();
            });
        });
    });
});
