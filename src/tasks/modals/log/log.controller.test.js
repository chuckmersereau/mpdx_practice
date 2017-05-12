import log from './log.controller';
import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import each from 'lodash/fp/each';
import isEqual from 'lodash/fp/isEqual';
import union from 'lodash/fp/union';

let contactList = [];
const defaultTask = { completed: true };

describe('tasks.modals.log.controller', () => {
    let $ctrl, controller, contacts, tasks, scope, state;
    beforeEach(() => {
        angular.mock.module(log);
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
    function loadController() {
        return controller('logTaskController as $ctrl', {
            $scope: scope,
            contactsList: contactList
        });
    }
    function defaultPartnerStatus() {
        $ctrl.task = assign(defaultTask, {
            activity_type: 'Active'
        });
        $ctrl.contactsList = [1];
    }
    describe('constructor', () => {
        it('should clone the list of contacts', () => {
            expect(isEqual($ctrl.contactsList, contactList)).toBeTruthy();
            expect($ctrl.contactsList !== contactList).toBeTruthy();
        });

        it('should set the new task model to complete', () => {
            expect($ctrl.task).toEqual(defaultTask);
        });
    });
    describe('called from a contact view page', () => {
        beforeEach(() => {
            state.current.name = 'contacts.show';
            contacts.current = {id: 2};
            loadController();
        });
        it('should add the current contact', () => {
            expect($ctrl.contactsList).toEqual(union(contactList, 2));
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
            spyOn(contacts, 'bulkEditFields').and.callFake(() => new Promise(resolve => resolve({})));
            scope.$hide = () => {};
            spyOn(scope, '$hide');
        });
        it('should create a task', () => {
            $ctrl.save();
            expect(tasks.create).toHaveBeenCalledWith($ctrl.task, $ctrl.contactsList, $ctrl.comment);
        });
        it('should update contacts if conditions are met', () => {
            $ctrl.status = 'Active';
            defaultPartnerStatus();
            $ctrl.save();
            expect(contacts.bulkEditFields).toHaveBeenCalledWith({ status: $ctrl.status }, $ctrl.task.contacts);
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
    describe('showPartnerStatus', () => {
        beforeEach(() => {
            //default to true conditions
            defaultPartnerStatus();
        });
        it('should be true when conditions are met', () => {
            expect($ctrl.showPartnerStatus()).toBeTruthy();
        });
        it('should be false with empty contactList', () => {
            $ctrl.contactsList = [];
            expect($ctrl.showPartnerStatus()).toBeFalsy();
        });
        it('should be false without a task activity_type', () => {
            $ctrl.task = defaultTask;
            expect($ctrl.showPartnerStatus()).toBeFalsy();
        });
        it('should be false when certain activity_types are set', () => {
            const arr = ['Pre Call Letter', 'Reminder Letter', 'Support Letter', 'Thank', 'To Do'];
            each(activity => {
                $ctrl.task.activity_type = activity;
                expect($ctrl.showPartnerStatus()).toBeFalsy();
            }, arr);
        });
    });
});