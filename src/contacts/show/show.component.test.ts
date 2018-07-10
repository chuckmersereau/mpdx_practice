import { each } from 'lodash/fp';
import component from './show.component';

describe('contacts.show.component', () => {
    let $ctrl, gettextCatalog, rootScope, scope, componentController,
        api, contacts, contactsTags, users,
        state, transitions, q;

    function loadController() {
        $ctrl = componentController('contact', { $scope: scope }, {});
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _contacts_, _contactsTags_,
            _gettextCatalog_, _api_, _users_, $state, $transitions, $q
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            contacts = _contacts_;
            contactsTags = _contactsTags_;
            gettextCatalog = _gettextCatalog_;
            users = _users_;
            state = $state;
            transitions = $transitions;
            q = $q;
            api.account_list_id = 1234;
            contacts.current = { id: 1, name: 'a b' };
            componentController = $componentController;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callFake((data) => data);
    });

    describe('constructor', () => {
        it('should set active tab to default', () => {
            expect(contacts.activeTab).toEqual('donations');
        });

        it('should set active tab to state', () => {
            state.$current.name = 'contacts.details.detail';
            loadController();
            expect(contacts.activeTab).toEqual('detail');
        });

        it('should set tab data', () => {
            expect($ctrl.tabsLabels).toEqual(jasmine.any(Array));
            each((tab) => {
                expect(tab.key).toEqual(jasmine.any(String));
                expect(tab.value).toEqual(jasmine.any(String));
                expect([jasmine.any(Boolean), undefined]).toContain(tab.drawerable);
            }, $ctrl.tabsLabels);
        });

        it('should handle custom tab order', () => {
            users.currentOptions = { contact_tabs_sort: { value: 'notes,addresses' } };
            loadController();
            expect($ctrl.tabsLabels[0].key).toEqual('notes');
            expect($ctrl.tabsLabels[1].key).toEqual('addresses');
            expect($ctrl.tabsLabels[2].key).toEqual('details');
        });
    });

    describe('$onInit', () => {
        it('should change state on account list change', () => {
            spyOn(state, 'go').and.callFake(() => {});
            $ctrl.$onInit();
            scope.$emit('accountListUpdated');
            scope.$digest();
            expect(state.go).toHaveBeenCalledWith('contacts');
            expect($ctrl.watcher).toBeDefined();
        });

        it('should call setActiveDrawer', () => {
            spyOn($ctrl, 'setActiveDrawer').and.callFake(() => {});
            contacts.activeDrawer = 'abc';
            $ctrl.$onInit();
            expect($ctrl.setActiveDrawer).toHaveBeenCalledWith('abc');
        });

        describe('activeTab === addresses', () => {
            beforeEach(() => {
                contacts.activeTab = 'addresses';
            });

            it('should call $state.go', () => {
                spyOn(state, 'go').and.callFake(() => {});
                $ctrl.$onInit();
                expect(state.go).toHaveBeenCalledWith('contacts.show.addresses');
            });
        });

        describe('$transitions.onStart callback', () => {
            it('should set call', () => {
                spyOn(transitions, 'onStart').and.callFake((options, fn) => {
                    spyOn($ctrl, 'setActiveTab').and.callFake(() => {});
                    fn();
                    expect($ctrl.setActiveTab).toHaveBeenCalled();
                });
                $ctrl.$onInit();
                expect(transitions.onStart).toHaveBeenCalledWith(
                    { to: 'contacts.show.*' },
                    jasmine.any(Function)
                );
            });
        });

        it('should hide drawer on task drawer open', () => {
            spyOn($ctrl, 'setActiveDrawer').and.callFake(() => {});
            $ctrl.$onInit();
            scope.$emit('taskDrawerOpened');
            scope.$digest();
            expect($ctrl.setActiveDrawer).toHaveBeenCalledWith(null);
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
            $ctrl.watcher2 = () => {};
            $ctrl.watcher3 = () => {};
            $ctrl.watcher4 = () => {};
            spyOn(state, 'go').and.callFake(() => {});
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            spyOn($ctrl, 'watcher3').and.callFake(() => {});
            spyOn($ctrl, 'watcher4').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalled();
            expect($ctrl.watcher2).toHaveBeenCalled();
            expect($ctrl.watcher3).toHaveBeenCalled();
            expect($ctrl.watcher4).toHaveBeenCalled();
            scope.$emit('accountListUpdated');
            scope.$digest();
            expect(state.go).not.toHaveBeenCalled();
        });
    });

    describe('onPrimary', () => {
        beforeEach(() => {
            spyOn(contacts, 'saveCurrent').and.callFake(() => {});
        });

        it('should return if personId isn\'t set', () => {
            const initialValue = angular.copy(contacts.current.primary_person);
            $ctrl.onPrimary();
            expect(contacts.current.primary_person).toEqual(initialValue);
            expect(contacts.saveCurrent).not.toHaveBeenCalled();
        });

        it('should return if personId is already the same value', () => {
            contacts.current.primary_person = { id: 1 };
            const initialValue = angular.copy(contacts.current.primary_person);
            $ctrl.onPrimary(1);
            expect(contacts.current.primary_person).toEqual(initialValue);
            expect(contacts.saveCurrent).not.toHaveBeenCalled();
        });

        it('should set the primary person', () => {
            contacts.current = { id: 1 };
            $ctrl.onPrimary(1);
            expect(contacts.saveCurrent).toHaveBeenCalled();
            expect(contacts.current.primary_person.id).toEqual(1);
        });
    });

    describe('setActiveTab', () => {
        const transition = {
            to: () => {
                return { name: 'contacts.show.tasks' };
            }
        };

        it('should set activeTab', () => {
            $ctrl.setActiveTab(transition);
            expect(contacts.activeTab).toEqual('tasks');
        });

        it('should set activeDrawer', () => {
            contacts.activeDrawer = 'tasks';
            $ctrl.setActiveTab(transition);
            expect(contacts.activeDrawer).toEqual('');
        });
    });

    describe('setActiveDrawer', () => {
        it('should set active drawer', () => {
            const drawer = 'a';
            $ctrl.setActiveDrawer(drawer);
            expect(contacts.activeDrawer).toEqual(drawer);
        });

        it('should handle tab duplicate', () => {
            spyOn(state, 'go').and.callFake(() => {});
            contacts.activeTab = 'a';
            const drawer = 'a';
            $ctrl.setActiveDrawer(drawer);
            expect(state.go).toHaveBeenCalledWith('contacts.show.donations');
        });
    });
});
