import component from './offlineOrganization.component';

describe('preferences.admin.offlineOrganization.component', () => {
    let $ctrl, componentController, scope, rootScope, alerts, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _alerts_, _api_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            alerts = _alerts_;
            api = _api_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('preferencesAdminOfflineOrganization', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.offlineOrganization).toEqual({ name: '', org_help_url: '', country: '' });
            expect($ctrl.saving).toEqual(false);
        });
    });

    describe('save', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.offlineOrganization = { name: 'Cru', org_help_url: 'https://cru.org', country: 'nz' };
        });

        it('should set saving to true', () => {
            $ctrl.save();
            expect($ctrl.saving).toEqual(true);
        });

        it('should call the api', () => {
            $ctrl.save();
            expect(api.post).toHaveBeenCalledWith({
                url: 'admin/organizations',
                data: { name: 'Cru', org_help_url: 'https://cru.org', country: 'nz' },
                type: 'organizations'
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

            it('should reset offline organization', (done) => {
                $ctrl.save().then(() => {
                    expect($ctrl.offlineOrganization).toEqual({ name: '', org_help_url: '', country: '' });
                    done();
                });
            });

            it('should call alerts.addAlert', (done) => {
                spyOn(alerts, 'addAlert').and.callThrough();
                $ctrl.save().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith('Successfully created offline organization', 'success');
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

            it('should call alerts.addAlert', (done) => {
                spyOn(alerts, 'addAlert').and.callThrough();
                $ctrl.save().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith('Unable to create offline organization', 'danger');
                    done();
                });
            });
        });
    });
});
