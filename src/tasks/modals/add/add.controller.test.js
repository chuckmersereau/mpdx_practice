import add from './add.controller';
import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import isEqual from 'lodash/fp/isEqual';
import union from 'lodash/fp/union';

let contactList = [];

describe('tasks.modals.add.controller', () => {
    let $ctrl, controller, contacts, tasks, scope, state;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, _contacts_, _tasks_, $state) => {
            scope = $rootScope.$new();
            state = $state;
            contacts = _contacts_;
            tasks = _tasks_;
            controller = $controller;
            $ctrl = loadController();
            const result = [{id: 1, name: 'a'}];
            spyOn(contacts, 'getNames').and.callFake(() => new Promise(resolve => resolve(result)));
        });
    });
    function loadController(activityType) {
        return controller('addTaskController as $ctrl', {
            $scope: scope,
            contactsList: contactList,
            activityType: activityType
        });
    }
    describe('constructor', () => {
        const activity = 'Call';
        beforeEach(() => {
            $ctrl = loadController(activity);
        });
        it('should clone the list of contacts', () => {
            expect(isEqual($ctrl.contactsList, contactList)).toBeTruthy();
            expect($ctrl.contactsList !== contactList).toBeTruthy();
        });

        it('should set task activity_type to injected param', () => {
            expect($ctrl.task.activity_type).toEqual(activity);
        });
    });
    describe('called from a contact view page', () => {
        beforeEach(() => {
            state.current.name = 'contacts.show';
            contacts.current = {id: 2};
            $ctrl = loadController();
        });
        it('should add the current contact', () => {
            expect($ctrl.contactsList).toEqual(union(contactList, [2]));
        });
    });
    describe('activate', () => {
        it('should get and assign contact names', (done) => {
            $ctrl.activate().then(() => {
                expect($ctrl.contactNames).toEqual({1: 'a'});
                done();
            });
            expect(contacts.getNames).toHaveBeenCalledWith(contactList);
        });
    });
    describe('addContact', () => {
        it('should add an empty contact', () => {
            const starterValue = angular.copy($ctrl.contactsList);
            $ctrl.addContact();
            expect($ctrl.contactsList).toEqual(concat(starterValue, ''));
        });
    });
    describe('setContact', () => {
        it('should do nothing on empty params', () => {
            const startingContacts = angular.copy($ctrl.contactsList);
            const startingNames = angular.copy($ctrl.contactNames);
            $ctrl.setContact(null, 0);
            expect($ctrl.contactNames).toEqual(startingNames);
            expect($ctrl.contactsList).toEqual(startingContacts);
        });
        it('should set the contact id in contactList', () => {
            const newVal = {id: 2, name: 'b'};
            $ctrl.contactsList = [1];
            $ctrl.contactNames = {1: 'a'};
            $ctrl.setContact(newVal, 0);
            expect($ctrl.contactsList).toEqual([newVal.id]);
        });
        it('should update a contact name in contactNames', () => {
            const newVal = {id: 1, name: 'b'};
            $ctrl.contactsList = [1];
            $ctrl.contactNames = {1: 'a'};
            $ctrl.setContact(newVal, 0);
            expect($ctrl.contactNames).toEqual({[newVal.id]: newVal.name});
        });
        it('should add a contact name in contactNames', () => {
            const newVal = {id: 2, name: 'b'};
            $ctrl.contactsList = [1];
            $ctrl.contactNames = {1: 'a'};
            const startingVal = angular.copy($ctrl.contactNames);
            $ctrl.setContact(newVal, 0);
            expect($ctrl.contactNames).toEqual(assign(startingVal, {[newVal.id]: newVal.name}));
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'create').and.callFake(() => new Promise(resolve => resolve({})));
            spyOn(tasks, 'addModal').and.callFake(() => new Promise(resolve => resolve({})));
            scope.$hide = () => {};
            spyOn(scope, '$hide').and.callThrough();
        });
        it('should create a task', () => {
            $ctrl.save();
            expect(tasks.create).toHaveBeenCalledWith($ctrl.task, $ctrl.contactsList, $ctrl.comment);
        });
        xit('should hide the modal when finished', (done) => {
            $ctrl.save().then(() => {
                done();
            });
            expect(scope.$hide).toHaveBeenCalled();
        });
        xit('should open next automation task if defined', (done) => {
            $ctrl.task.next_action = 'Call';
            $ctrl.save().then(() => {
                expect(tasks.addModal).toHaveBeenCalledWith($ctrl.contactsList, $ctrl.task.next_action);
                done();
            });
            expect(scope.$hide).toHaveBeenCalled();
        });
    });
});