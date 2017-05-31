import component from './people.component';

describe('contacts.show.people.component', () => {
    let $ctrl, rootScope, scope, componentController, alerts, api, gettextCatalog, people;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _alerts_, _api_, _gettextCatalog_, _people_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            api = _api_;
            componentController = $componentController;
            alerts = _alerts_;
            gettextCatalog = _gettextCatalog_;
            api.account_list_id = 1234;
            people = _people_;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake(() => {});
        spyOn(gettextCatalog, 'getString').and.callFake(data => data);
    });
    function loadController() {
        $ctrl = componentController('contactPeople', {$scope: scope}, {view: null, selected: null});
    }
    describe('constructor', () => {
        it('should have default values', () => {
            expect($ctrl.data).toEqual([]);
            expect($ctrl.isMerging).toBeFalsy();
        });
    });
    describe('events', () => {
        beforeEach(() => {
            spyOn($ctrl, 'init').and.callFake(() => {});
        });
        xit('should handle accountListUpdated', () => { //will work once contact tags handles events in component
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect($ctrl.init).toHaveBeenCalled();
        });
        it('should handle personUpdated', () => { //will work once contact tags handles events in component
            rootScope.$emit('personUpdated');
            rootScope.$digest();
            expect($ctrl.init).toHaveBeenCalled();
        });
    });
    describe('init', () => {
        it('should exit if contact is undefined', () => {
            $ctrl.contact = null;
            expect($ctrl.init()).toBeUndefined();
        });
        it('should reset data before reloading to trigger rebinding', () => {
            $ctrl.contact = {id: 1};
            $ctrl.data = [3, 4];
            $ctrl.init();
            expect($ctrl.data).toEqual([]);
        });
        it('should get a list of people for a contact', done => {
            $ctrl.contact = {id: 1};
            spyOn(people, 'list').and.callFake(() => Promise.resolve([1, 2]));
            $ctrl.init(1).then(() => {
                expect($ctrl.data).toEqual([1, 2]);
                done();
            });
            expect(people.list).toHaveBeenCalledWith(1);
        });
    });
    describe('openMergeModal', () => {
        it(`should display a translated message if at least 2 people aren't selected`, () => {
            $ctrl.selectedPeople = [1];
            $ctrl.openMergeModal();
            expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
        });
        it('should hide the merging view', () => {
            $ctrl.selectedPeople = [1, 2];
            $ctrl.openMergeModal();
            expect($ctrl.isMerging).toBeFalsy();
        });
        it('should open the merge modal', done => {
            spyOn(people, 'openMergePeopleModal').and.callFake(() => Promise.resolve());
            $ctrl.selectedPeople = [1, 2];
            $ctrl.openMergeModal().then(() => {
                expect(people.openMergePeopleModal).toHaveBeenCalledWith([1, 2]);
                expect($ctrl.selectedPeople).toEqual([]);
                done();
            });
        });
        it('should handle catch', done => {
            spyOn(people, 'openMergePeopleModal').and.callFake(() => Promise.reject(Error('err')));
            $ctrl.selectedPeople = [1, 2];
            $ctrl.openMergeModal().then(() => {
                expect($ctrl.selectedPeople).toEqual([]);
                done();
            });
        });
    });
});
