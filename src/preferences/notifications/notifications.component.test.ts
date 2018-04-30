import component from './notifications.component';

describe('contacts.list.component', () => {
    let $ctrl, api, serverConstants, scope, componentController, rootScope, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _api_, _serverConstants_, $q) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            api = _api_;
            serverConstants = _serverConstants_;
            q = $q;
            componentController = $componentController;
            loadController();
        });
        spyOn($ctrl, 'gettext').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController(
            'preferencesNotifications', { $scope: scope }, { onSave: () => q.resolve(), setup: null }
        );
    }
    describe('$onInit', () => {
        it('should transform the users notification preferences with server constants', () => {
            spyOn($ctrl, 'load').and.callFake(() => q.resolve());
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalled();
        });

        describe('events', () => {
            beforeEach(() => {
                $ctrl.$onInit();
                spyOn($ctrl, 'load').and.callFake(() => q.resolve());
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
            spy = spyOn(api, 'get').and.callFake(() => q.resolve([{
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
            const errorMessage = 'Unable to load notification preferences';
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith(
                'account_lists/account_list_id/notification_preferences?include=notification_type',
                undefined, undefined, errorMessage
            );
            expect($ctrl.gettext).toHaveBeenCalledWith(errorMessage);
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
                scope.$digest();
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
                scope.$digest();
            });
        });
        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => q.reject(Error('something went wrong')));
            });

            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.load().catch(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
                scope.$digest();
            });

            it('should throw exception', (done) => {
                $ctrl.load().catch((ex) => {
                    expect(ex).toEqual(Error('something went wrong'));
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('save', () => {
        let spy;

        beforeEach(() => {
            api.account_list_id = 'account_list_id';
            spy = spyOn(api, 'post').and.callFake(() => q.resolve());
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.save();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call api.post', () => {
            const successMessage = 'Notifications saved successfully';
            const errorMessage = 'Unable to save changes';
            $ctrl.save();
            expect(api.post).toHaveBeenCalledWith({
                url: 'account_lists/account_list_id/notification_preferences/bulk',
                data: $ctrl.notificationPreferences,
                type: 'notification_preferences',
                fields: { notification_preferences: '' },
                successMessage: successMessage,
                errorMessage: errorMessage
            });
            expect($ctrl.gettext).toHaveBeenCalledWith(successMessage);
            expect($ctrl.gettext).toHaveBeenCalledWith(errorMessage);
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(q));
        });


        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.save().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
                scope.$digest();
            });

            it('should call onSave', (done) => {
                spyOn($ctrl, 'onSave').and.callFake(() => q.resolve());
                $ctrl.save().then(() => {
                    expect($ctrl.onSave).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });
        });

        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => q.reject(Error('something went wrong')));
            });

            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.save().catch(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
                scope.$digest();
            });

            it('should throw exception', (done) => {
                $ctrl.save().catch((ex) => {
                    expect(ex).toEqual(Error('something went wrong'));
                    done();
                });
                scope.$digest();
            });
        });
    });
});
