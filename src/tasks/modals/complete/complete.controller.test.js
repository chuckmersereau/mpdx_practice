import complete from './complete.controller';
import assign from 'lodash/fp/assign';
import each from 'lodash/fp/each';

const defaultTask = { id: 1, contacts: [{ id: 1 }] };

describe('tasks.modals.complete.controller', () => {
    let $ctrl, controller, contacts, tasks, scope;
    beforeEach(() => {
        angular.mock.module(complete);
        inject(($controller, $rootScope, _contacts_, _tasks_) => {
            scope = $rootScope.$new();
            contacts = _contacts_;
            tasks = _tasks_;
            controller = $controller;
            $ctrl = loadController();
        });
    });
    function loadController() {
        return controller('completeTaskController as $ctrl', {
            $scope: scope,
            task: defaultTask
        });
    }
    function defaultPartnerStatus() {
        $ctrl.task = assign(defaultTask, {
            activity_type: 'Active'
        });
    }
    describe('constructor', () => {
        it('should clone the task and set the new task model to complete', () => {
            expect($ctrl.task).toEqual(assign(defaultTask, { completed: true }));
            expect($ctrl.task !== $ctrl.taskInitialState).toBeTruthy();
        });
    });
    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'save').and.callFake(() => Promise.resolve({}));
            spyOn(tasks, 'addModal').and.callFake(() => Promise.resolve({}));
            spyOn(contacts, 'bulkSave').and.callFake(() => Promise.resolve({}));
            scope.$hide = () => {};
            spyOn(scope, '$hide');
        });
        it('should update a contact', () => {
            $ctrl.status = 'Active';
            defaultPartnerStatus();
            $ctrl.save();
            expect(contacts.bulkSave).toHaveBeenCalledWith([{ id: 1, status: $ctrl.status }]);
        });
        it('should hide the modal when finished', (done) => {
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
        it('should open next automation task if defined', (done) => {
            $ctrl.task.next_action = 'Call';
            $ctrl.save().then(() => {
                expect(tasks.addModal).toHaveBeenCalledWith([1], $ctrl.task.next_action);
                done();
            });
        });
    });
    describe('showPartnerStatus', () => {
        beforeEach(() => {
            // default to true conditions
            defaultPartnerStatus();
        });
        it('should be true when conditions are met', () => {
            expect($ctrl.showPartnerStatus()).toBeTruthy();
        });
        it('should be false with empty contactList', () => {
            $ctrl.task.contacts = [];
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