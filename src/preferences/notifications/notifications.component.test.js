import component from './notifications.component';

describe('contacts.list.component', () => {
    let $ctrl, api, serverConstants, scope, componentController, rootScope, alerts, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_, _serverConstants_, _alerts_, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            api = _api_;
            alerts = _alerts_;
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            componentController = $componentController;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController(
            'preferencesNotifications', { $scope: scope }, { onSave: () => Promise.resolve(), setup: null }
        );
    }
    describe('$onInit', () => {
        it('should transform the users notification preferences with server constants', () => {
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalled();
        });

        describe('events', () => {
            beforeEach(() => {
                $ctrl.$onInit();
                spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            });

            afterEach(() => {
                $ctrl.$onDestroy();
            });

            it('should fire contacts.load on contactCreated', () => {
                rootScope.$emit('accountListUpdated');
                expect($ctrl.load).toHaveBeenCalled();
            });
        });
    });

    describe('$onDestroy', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });

        it('should remove watchers', () => {
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalled();
        });
    });

    describe('load', () => {
        let spy;

        beforeEach(() => {
            api.account_list_id = 'account_list_id';
            spy = spyOn(api, 'get').and.callFake(() => Promise.resolve([{
                id: '1234',
                notification_type: { id: '11a42c09-2ed1-4754-9b43-2d14a2a3b420' },
                email: true,
                task: true
            }]));
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call api.get', () => {
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/account_list_id/notification_preferences?include=notification_type'
            );
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
            });

            it('should convert data', (done) => {
                serverConstants.data = {
                    notification_translated_hashes: [{
                        id: 'Partner gave a Special Gift',
                        key: '11a42c09-2ed1-4754-9b43-2d14a2a3b420',
                        value: 'Partner gave a Special Gift'
                    }, {
                        id: 'Partner missed a gift',
                        key: 'abe134az-2ed1-4754-9b43-2d14a2a123cd',
                        value: 'Partner missed a gift'
                    }]
                };
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.notificationPreferences).toEqual([{
                        id: '1234',
                        notification_type: { id: '11a42c09-2ed1-4754-9b43-2d14a2a3b420' },
                        title: 'Partner gave a Special Gift',
                        email: true,
                        task: true,
                        override: true
                    }, {
                        id: jasmine.any(String),
                        notification_type: { id: 'abe134az-2ed1-4754-9b43-2d14a2a123cd' },
                        title: 'Partner missed a gift',
                        email: true,
                        task: true,
                        override: true
                    }]);
                    done();
                });
            });
        });
        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => Promise.reject(Error('something went wrong')));
            });

            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.load().catch(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
            });

            it('should call alert.addAlert', (done) => {
                $ctrl.load().catch(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith('Unable to load notification preferences', 'danger');
                    done();
                });
            });

            it('should throw exception', (done) => {
                $ctrl.load().catch((ex) => {
                    expect(ex).toEqual(Error('something went wrong'));
                    done();
                });
            });
        });
    });

    describe('save', () => {
        let spy;

        beforeEach(() => {
            api.account_list_id = 'account_list_id';
            spy = spyOn(api, 'post').and.callFake(() => Promise.resolve());
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.save();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call api.post', () => {
            $ctrl.save();
            expect(api.post).toHaveBeenCalledWith({
                url: 'account_lists/account_list_id/notification_preferences/bulk',
                data: $ctrl.notificationPreferences,
                type: 'notification_preferences'
            });
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });


        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.save().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
            });

            it('should call onSave', (done) => {
                spyOn($ctrl, 'onSave').and.callFake(() => Promise.resolve());
                $ctrl.save().then(() => {
                    expect($ctrl.onSave).toHaveBeenCalled();
                    done();
                });
            });

            it('should call alert.addAlert', (done) => {
                $ctrl.save().then(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith('Notifications saved successfully', 'success');
                    done();
                });
            });
        });

        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => Promise.reject(Error('something went wrong')));
            });

            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.save().catch(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
            });

            it('should call alert.addAlert', (done) => {
                $ctrl.save().catch(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith('Unable to save changes', 'danger');
                    done();
                });
            });

            it('should throw exception', (done) => {
                $ctrl.save().catch((ex) => {
                    expect(ex).toEqual(Error('something went wrong'));
                    done();
                });
            });
        });
    });
});
