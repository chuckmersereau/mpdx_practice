import add from './add.controller';
import assign from 'lodash/fp/assign';
import concat from 'lodash/fp/concat';
import moment from 'moment';
import isEqual from 'lodash/fp/isEqual';
import union from 'lodash/fp/union';

let contactList = [];

describe('tasks.modals.add.controller', () => {
    let $ctrl, controller, contacts, tasks, scope, state;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, _contacts_, _tasks_, $state, _users_) => {
            scope = $rootScope.$new();
            state = $state;
            contacts = _contacts_;
            tasks = _tasks_;
            controller = $controller;
            _users_.current = { id: 234 };
            $ctrl = loadController();
            const result = [{ id: 1, name: 'a' }];
            spyOn(contacts, 'getNames').and.callFake(() => new Promise((resolve) => resolve(result)));
        });
    });

    function loadController(activityType = null, task = null) {
        return controller('addTaskController as $ctrl', {
            $scope: scope,
            contactsList: contactList,
            activityType: activityType,
            task: task,
            comments: null
        });
    }
    describe('called from a contact view page', () => {
        beforeEach(() => {
            state.current.name = 'contacts.show';
            contacts.current = { id: 2 };
            $ctrl = loadController();
        });
        it('should add the current contact', () => {
            expect($ctrl.contactsList).toEqual(union(contactList, [2]));
        });
    });
    describe('activate', () => {
        describe('new task', () => {
            const activity = 'Call';
            const params = {
                activityType: activity,
                comments: null,
                contactsList: [],
                task: null
            };
            beforeEach(() => {
                spyOn($ctrl, 'reuseTask').and.callFake(() => false);
                spyOn($ctrl, 'useContacts').and.callFake(() => true);
            });
            it('should clone the list of contacts', () => {
                $ctrl.activate(params);
                expect(isEqual($ctrl.contactsList, contactList)).toBeTruthy();
                expect($ctrl.contactsList !== contactList).toBeTruthy();
            });

            it('should set task activity_type to injected param', () => {
                $ctrl.activate(params);
                expect($ctrl.task.activity_type).toEqual(activity);
            });
            it('should get and assign contact names', (done) => {
                $ctrl.activate(params).then(() => {
                    expect($ctrl.contactNames).toEqual({ 1: 'a' });
                    done();
                });
                expect(contacts.getNames).toHaveBeenCalledWith(contactList);
            });
        });
        describe('follow up task', () => {
            const activity = 'Call';
            const comments = ['abc', 'def'];
            const contactsList = [{ id: 1 }];
            const task = {
                subject: 'A',
                tag_list: ['taggy']
            };
            const params = {
                activityType: activity,
                comments: comments,
                contactsList: contactsList,
                task: task
            };
            beforeEach(() => {
                spyOn($ctrl, 'reuseTask').and.callFake(() => true);
                spyOn($ctrl, 'useContacts').and.callFake(() => false);
                spyOn($ctrl, 'mutateComments').and.callFake(() => ['a']);
                jasmine.clock().install();
                const day = moment('2015-12-22').toDate();
                jasmine.clock().mockDate(day);
            });
            afterEach(function() {
                jasmine.clock().uninstall();
            });
            it('should create a task', () => {
                $ctrl.activate(params);
                expect($ctrl.task).toEqual({
                    activity_type: activity,
                    comments: ['a'],
                    start_at: moment().add(2, 'd').toISOString(),
                    subject: 'A',
                    tag_list: ['taggy']
                });
            });
        });
    });
    describe('reuseTask', () => {
        it('should be true', () => {
            expect($ctrl.reuseTask({ result: 'Attempted' }, 'call')).toBeTruthy();
            expect($ctrl.reuseTask({ result: 'Attempted - Left Message' }, 'call')).toBeTruthy();
        });
        it('should be false', () => {
            expect($ctrl.reuseTask({ result: null }, 'call')).toBeFalsy();
            expect($ctrl.reuseTask({ result: 'Attempted - Left Message' }, undefined)).toBeFalsy();
        });
    });
    describe('useContacts', () => {
        it('should be true', () => {
            expect($ctrl.useContacts(undefined, false)).toBeTruthy();
            expect($ctrl.useContacts({ result: 'Attempted - Left Message' }, true)).toBeTruthy();
        });
        it('should be false', () => {
            expect($ctrl.useContacts({ result: '' }, false)).toBeFalsy();
            expect($ctrl.useContacts({ result: 'Attempted - Left Message' }, undefined)).toBeFalsy();
        });
    });
    describe('mutateComments', () => {
        it('should build a comment array', () => {
            expect($ctrl.mutateComments(['abc', 'def'])).toEqual([
                { id: jasmine.any(String), body: 'abc', person: { id: 234 } },
                { id: jasmine.any(String), body: 'def', person: { id: 234 } }
            ]);
        });
        it('should still build a comment array', () => {
            expect($ctrl.mutateComments([{ id: 333, body: 'abc', person: { id: 234 } }, 'def'])).toEqual([
                { id: jasmine.any(String), body: 'abc', person: { id: 234 } },
                { id: jasmine.any(String), body: 'def', person: { id: 234 } }
            ]);
        });
        it('should handle no comments', () => {
            expect($ctrl.mutateComments([])).toEqual(null);
        });
        it('should handle empty comments', () => {
            expect($ctrl.mutateComments([''])).toEqual(null);
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
            const newVal = { id: 2, name: 'b' };
            $ctrl.contactsList = [1];
            $ctrl.contactNames = { 1: 'a' };
            $ctrl.setContact(newVal, 0);
            expect($ctrl.contactsList).toEqual([newVal.id]);
        });
        it('should update a contact name in contactNames', () => {
            const newVal = { id: 1, name: 'b' };
            $ctrl.contactsList = [1];
            $ctrl.contactNames = { 1: 'a' };
            $ctrl.setContact(newVal, 0);
            expect($ctrl.contactNames).toEqual({ [newVal.id]: newVal.name });
        });
        it('should add a contact name in contactNames', () => {
            const newVal = { id: 2, name: 'b' };
            $ctrl.contactsList = [1];
            $ctrl.contactNames = { 1: 'a' };
            const startingVal = angular.copy($ctrl.contactNames);
            $ctrl.setContact(newVal, 0);
            expect($ctrl.contactNames).toEqual(assign(startingVal, { [newVal.id]: newVal.name }));
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'create').and.callFake(() => Promise.resolve({}));
            spyOn(tasks, 'addModal').and.callFake(() => Promise.resolve({}));
        });
        it('should create a task', () => {
            $ctrl.save();
            expect(tasks.create).toHaveBeenCalledWith($ctrl.task, $ctrl.contactsList, $ctrl.comment);
        });
        it('shouldn\'t have a start date if setDueDate false', () => {
            $ctrl.setDueDate = false;
            $ctrl.save();
            expect($ctrl.task.start_at).toEqual(null);
        });
        it('should hide the modal when finished', (done) => {
            scope.$hide = () => {};
            spyOn(scope, '$hide').and.callFake(() => {});
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
    });
});