import component from './people.component';

describe('contacts.show.people.component', () => {
    let $ctrl, rootScope, scope, componentController, alerts, api, gettextCatalog, people, _$window;
    beforeEach(() => {
        angular.mock.module(component);

        inject((
            $componentController, $rootScope, $window,
            _alerts_, _api_, _gettextCatalog_, _people_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = $rootScope.$new();

            alerts = _alerts_;
            api = _api_;
            _$window = $window;
            gettextCatalog = _gettextCatalog_;
            people = _people_;

            api.account_list_id = 1234;

            loadController();
        });

        spyOn(alerts, 'addAlert').and.callFake(() => {});
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('contactPeople', { $scope: scope }, { view: null, selected: null });
    }

    describe('constructor', () => {
        it('should have default values', () => {
            expect($ctrl.data).toEqual([]);
            expect($ctrl.isMerging).toBeFalsy();
        });
    });

    describe('$onInit', () => {
        it('should call people.listAll', () => {
            spyOn(people, 'listAll').and.callFake(() => {});
            $ctrl.$onInit();
            expect(people.listAll).toHaveBeenCalled();
        });
    });

    describe('events', () => {
        beforeEach(() => $ctrl.$onInit());

        it('should handle accountListUpdated', () => {
            spyOn($ctrl, 'init').and.callFake(() => {});
            rootScope.$emit('accountListUpdated');
            expect($ctrl.init).toHaveBeenCalled();
        });

        it('should handle personCreated', () => {
            spyOn(people, 'get').and.callFake(() => Promise.resolve({ id: 123 }));
            rootScope.$emit('personCreated', 123);
            expect(people.get).toHaveBeenCalledWith(123);
        });

        it('should handle personDeleted', () => {
            $ctrl.data = [{ id: 123 }];
            rootScope.$emit('personDeleted', 123);
            expect($ctrl.data).toEqual([]);
        });

        it('should handle peopleMerged', () => {
            $ctrl.data = [{ id: 123 }, { id: 234 }];
            rootScope.$emit('peopleMerged', 123, [234]);
            expect($ctrl.data).toEqual([{ id: 123 }]);
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

    describe('init', () => {
        it('should exit if contact is undefined', () => {
            $ctrl.contact = null;
            expect($ctrl.init()).toBeUndefined();
        });

        it('should reset data before reloading to trigger rebinding', () => {
            $ctrl.contact = { id: 1 };
            $ctrl.data = [3, 4];
            $ctrl.init();
            expect($ctrl.data).toEqual([]);
        });

        it('should get a list of people for a contact', (done) => {
            $ctrl.contact = { id: 1 };
            spyOn(people, 'list').and.callFake(() => Promise.resolve([1, 2]));
            $ctrl.init(1).then(() => {
                expect($ctrl.data).toEqual([1, 2]);
                done();
            });
            expect(people.list).toHaveBeenCalledWith(1);
        });
    });

    describe('openMergeModal', () => {
        it('should display a translated message if at least 2 people aren\'t selected', () => {
            $ctrl.selectedPeople = [1];
            $ctrl.openMergeModal();
            expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
        });

        it('should open the merge modal', (done) => {
            spyOn(people, 'openMergePeopleModal').and.callFake(() => Promise.resolve());
            $ctrl.selectedPeople = [1, 2];
            $ctrl.openMergeModal().then(() => {
                expect(people.openMergePeopleModal).toHaveBeenCalledWith([1, 2]);
                expect($ctrl.selectedPeople).toEqual([]);
                expect($ctrl.isMerging).toBeFalsy();
                done();
            });
        });
    });

    describe('cancelMerge', () => {
        it('should set isMerging to false', () => {
            $ctrl.isMerging = true;
            $ctrl.cancelMerge();
            expect($ctrl.isMerging).toBeFalsy();
        });

        it('should set person.selected_for_merge to false', () => {
            let person1 = { selected_for_merge: true };
            let person2 = { selected_for_merge: true };
            $ctrl.data = [person1, person2];
            $ctrl.cancelMerge();
            expect(person1.selected_for_merge).toBeFalsy();
            expect(person2.selected_for_merge).toBeFalsy();
        });

        it('should set selectedPeople to []', () => {
            $ctrl.selectedPeople = [{}, {}];
            $ctrl.cancelMerge();
            expect($ctrl.selectedPeople).toEqual([]);
        });
    });
    describe('emailAll', () => {
        it('should open a mailto window', () => {
            spyOn(_$window, 'open').and.callFake(() => ({ close: () => {} }));
            $ctrl.data = [{ email_addresses: [{ primary: true, email: 'a@b.c' }, { email: 'b@b.c' }] }];
            $ctrl.emailAll();
            expect(_$window.open).toHaveBeenCalledWith('mailto:a@b.c');
        });
    });
});
