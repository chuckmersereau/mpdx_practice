import component from './person.component';

describe('contacts.show.info.person.component', () => {
    let $ctrl, rootScope, scope, componentController, contacts, q;
    beforeEach(() => {
        angular.mock.module(component);

        inject((
            $componentController, $rootScope, $q,
            _contacts_
        ) => {
            componentController = $componentController;
            rootScope = $rootScope;
            q = $q;
            scope = $rootScope.$new();
            contacts = _contacts_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('contactInfoPerson', { $scope: scope }, { contact: { id: 'contact_id' } });
    }

    describe('$onInit', () => {
        it('should setup watchers', () => {
            spyOn(rootScope, '$on').and.callFake(() => {});
            $ctrl.$onInit();
            expect(rootScope.$on).toHaveBeenCalledWith('changePrimaryPerson', jasmine.any(Function));
            expect(rootScope.$on).toHaveBeenCalledWith('personDeleted', jasmine.any(Function));
            expect(rootScope.$on).toHaveBeenCalledWith('personUpdated', jasmine.any(Function));
            expect(rootScope.$on).toHaveBeenCalledWith('peopleMerged', jasmine.any(Function));
        });

        it('should call load', () => {
            spyOn($ctrl, 'load').and.callFake(() => {});
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalled();
        });

        it('should set watcher variables', () => {
            spyOn(rootScope, '$on').and.returnValue(() => {});
            $ctrl.$onInit();
            expect($ctrl.watcher1).toEqual(jasmine.any(Function));
            expect($ctrl.watcher2).toEqual(jasmine.any(Function));
            expect($ctrl.watcher3).toEqual(jasmine.any(Function));
        });

        describe('events', () => {
            beforeEach(() => {
                let spy = spyOn($ctrl, 'load').and.callFake(() => q.resolve());
                $ctrl.$onInit();
                spy.calls.reset();
                $ctrl.person = { id: 'person_id' };
            });

            afterEach(() => {
                $ctrl.$onDestroy();
            });

            it('should fire load on changePrimaryPerson', () => {
                rootScope.$emit('changePrimaryPerson');
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalled();
            });

            it('should fire load on personDeleted', () => {
                rootScope.$emit('personDeleted', 'person_id');
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalled();
            });

            it('should fire load on personUpdated', () => {
                rootScope.$emit('personUpdated', 'person_id');
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalled();
            });

            it('should fire load on peopleMerged', () => {
                rootScope.$emit('peopleMerged', 'different_person_id_1', ['person_id']);
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalled();
            });

            describe('person changed does not match', () => {
                beforeEach(() => {
                    $ctrl.person = { id: 'different_person_id' };
                });

                it('should not fire load on personDeleted', () => {
                    rootScope.$emit('personDeleted', 'person_id');
                    rootScope.$digest();
                    expect($ctrl.load).not.toHaveBeenCalled();
                });

                it('should not fire load on personUpdated', () => {
                    rootScope.$emit('personUpdated', 'person_id');
                    rootScope.$digest();
                    expect($ctrl.load).not.toHaveBeenCalled();
                });

                it('should not fire load on peopleMerged', () => {
                    rootScope.$emit('peopleMerged', 'different_person_id_1', ['person_id']);
                    rootScope.$digest();
                    expect($ctrl.load).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('$onDestroy', () => {
        it('should destroy watchers', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher1');
            spyOn($ctrl, 'watcher2');
            spyOn($ctrl, 'watcher3');
            spyOn($ctrl, 'watcher4');
            $ctrl.$onDestroy();
            expect($ctrl.watcher1).toHaveBeenCalled();
            expect($ctrl.watcher2).toHaveBeenCalled();
            expect($ctrl.watcher3).toHaveBeenCalled();
            expect($ctrl.watcher4).toHaveBeenCalled();
        });
    });

    describe('load', () => {
        let spy;
        beforeEach(() => {
            spy = spyOn(contacts, 'getPrimaryPerson').and.callFake(() => q.resolve());
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call contacts.getPrimaryPerson', () => {
            $ctrl.load();
            expect(contacts.getPrimaryPerson).toHaveBeenCalledWith('contact_id');
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
                rootScope.$digest();
            });

            it('should set data to person', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.person).toEqual({
                        primaryEmailAddress: undefined,
                        primaryPhoneNumber: undefined
                    });
                    done();
                });
                rootScope.$digest();
            });

            it('should set primaryEmailAddress', (done) => {
                spy.and.callFake(() => q.resolve({
                    email_addresses: [{
                        primary: true, historic: true
                    }, {
                        primary: true, historic: false
                    }]
                }));

                $ctrl.load().then(() => {
                    expect($ctrl.person.primaryEmailAddress).toEqual({
                        primary: true, historic: false
                    });
                    done();
                });
                rootScope.$digest();
            });

            it('should set primaryPhoneNumber', (done) => {
                spy.and.callFake(() => q.resolve({
                    phone_numbers: [{
                        primary: true, historic: true
                    }, {
                        primary: true, historic: false
                    }]
                }));

                $ctrl.load().then(() => {
                    expect($ctrl.person.primaryPhoneNumber).toEqual({
                        primary: true, historic: false
                    });
                    done();
                });
                rootScope.$digest();
            });
        });
        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => q.reject(Error('something went wrong')));
            });

            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
                rootScope.$digest();
            });
        });
    });
});
