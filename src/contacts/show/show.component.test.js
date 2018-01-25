import component from './show.component';
import { assign } from 'lodash/fp';

describe('contacts.show.component', () => {
    let $ctrl, componentController, gettextCatalog, rootScope, scope, state,
        api, alerts, contacts, contactsTags, tasks, users;

    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _contacts_, _contactsTags_, _modal_, _tasks_, _alerts_,
            _gettextCatalog_, _api_, _users_, $state
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            contacts = _contacts_;
            contactsTags = _contactsTags_;
            gettextCatalog = _gettextCatalog_;
            state = $state;
            tasks = _tasks_;
            users = _users_;
            componentController = $componentController;
            api.account_list_id = 1234;
            contacts.current = { id: 1, name: 'a b' };
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn(gettextCatalog, 'getString').and.callFake((data) => data);
    });

    function loadController() {
        $ctrl = componentController('contact', { $scope: scope }, {});
    }
    describe('$onInit', () => {
        it('should change state on account list change', () => {
            spyOn(state, 'go').and.callFake(() => {});
            $ctrl.$onInit();
            scope.$emit('accountListUpdated');
            scope.$digest();
            expect(state.go).toHaveBeenCalledWith('contacts');
            expect($ctrl.watcher).toBeDefined();
        });
    });
    describe('$onChanges', () => {
        it('should display contact name in page title', () => {
            $ctrl.$onChanges();
            expect(rootScope.pageTitle).toEqual('Contact | a b');
        });
    });
    describe('$onDestroy', () => {
        it('should disable event', () => {
            $ctrl.watcher = () => {};
            spyOn(state, 'go').and.callFake(() => {});
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalled();
            scope.$emit('accountListUpdated');
            scope.$digest();
            expect(state.go).not.toHaveBeenCalled();
        });
    });
    describe('onPrimary', () => {
        beforeEach(() => {
            spyOn($ctrl, 'save').and.callFake(() => {});
        });
        it('should return if personId isn\'t set', () => {
            const initialValue = angular.copy(contacts.current.primary_person);
            $ctrl.onPrimary();
            expect(contacts.current.primary_person).toEqual(initialValue);
            expect($ctrl.save).not.toHaveBeenCalled();
        });
        it('should return if personId is already the same value', () => {
            contacts.current.primary_person = { id: 1 };
            const initialValue = angular.copy(contacts.current.primary_person);
            $ctrl.onPrimary(1);
            expect(contacts.current.primary_person).toEqual(initialValue);
            expect($ctrl.save).not.toHaveBeenCalled();
        });
        it('should set the primary person', () => {
            contacts.current = { id: 1 };
            $ctrl.onPrimary(1);
            expect($ctrl.save).toHaveBeenCalled();
            expect(contacts.current.primary_person.id).toEqual(1);
        });
    });
    describe('save', () => {
        beforeEach(() => {
            contacts.current = { id: 1, name: 'a' };
            contacts.initialState = { id: 1 };
            spyOn(rootScope, '$emit').and.callFake(() => Promise.resolve());
            spyOn(contactsTags, 'addTag').and.callFake(() => {});
        });
        it('should call save', () => {
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect(contacts.save).toHaveBeenCalledWith({ id: 1, name: 'a' });
        });
        it('should alert if successful', (done) => {
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('shouldn\'t broadcast if tag_list is unchanged', (done) => {
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(rootScope.$emit).not.toHaveBeenCalled();
                done();
            });
        });
        it('should broadcast if tag_list changed', (done) => {
            contacts.current = assign(contacts.current, { tag_list: 'a,b' });
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('contactTagsAdded', { tags: ['a', 'b'] });
                expect(contactsTags.addTag).toHaveBeenCalledWith({ tags: ['a', 'b'] });
                done();
            });
        });
        it('should update initialState', (done) => {
            contacts.initialState.no_gift_aid = false;
            contacts.current.no_gift_aid = true;
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(contacts.initialState.no_gift_aid).toEqual(true);
                done();
            });
        });
        it('should alert if rejected', (done) => {
            spyOn(contacts, 'save').and.callFake(() => Promise.reject());
            $ctrl.save().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
    describe('openAddTaskModal', () => {
        it('should open the add task modal', () => {
            spyOn(tasks, 'addModal').and.callFake(() => {});
            $ctrl.openAddTaskModal();
            expect(tasks.addModal).toHaveBeenCalledWith({ contactsList: [contacts.current.id] });
        });
    });
    describe('showRecommendationTab', () => {
        beforeEach(() => {
            users.current = {
                preferences: {
                    admin: false
                }
            };
        });

        it('should return false', () => {
            expect($ctrl.showRecommendationTab()).toBeFalsy();
        });

        describe('user has Cru - USA organization', () => {
            beforeEach(() => {
                users.organizationAccounts = [
                    {
                        organization: {
                            name: 'Cru - USA'
                        }
                    }
                ];
            });
            it('should return false', () => {
                expect($ctrl.showRecommendationTab()).toBeFalsy();
            });

            describe('user is admin', () => {
                beforeEach(() => {
                    users.current = {
                        preferences: {
                            admin: true
                        }
                    };
                });

                it('should return true', () => {
                    expect($ctrl.showRecommendationTab()).toEqual(true);
                });
            });
        });
    });
});
