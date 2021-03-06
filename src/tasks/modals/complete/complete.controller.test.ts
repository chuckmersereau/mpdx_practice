import { assign, each } from 'lodash/fp';
import complete from './complete.controller';

const defaultTask = { id: 1, contacts: [{ id: 1 }], activity_type: 'Call' };

describe('tasks.modals.complete.controller', () => {
    let $ctrl, contacts, tasks, scope, rootScope, q, serverConstants;
    beforeEach(() => {
        angular.mock.module(complete);
        inject(($controller, $q, $rootScope, _contacts_, _tasks_, _serverConstants_) => {
            q = $q;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            contacts = _contacts_;
            tasks = _tasks_;
            serverConstants = _serverConstants_;
            serverConstants.data = {
                results: {
                    call: ['a', 'b']
                }
            };
            $ctrl = $controller('completeTaskController as $ctrl', {
                $scope: scope,
                task: defaultTask
            });
        });
    });

    function defaultPartnerStatus() {
        $ctrl.task = assign(defaultTask, {
            activity_type: 'Active'
        });
    }

    describe('constructor', () => {
        it('should clone the task and set the new task model to complete', () => {
            expect($ctrl.task).toEqual(assign(defaultTask, { completed: true, result: 'a' }));
            expect($ctrl.task !== $ctrl.taskInitialState).toBeTruthy();
        });

        it('should set a default result', () => {
            expect($ctrl.task.result).toEqual('a');
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'save').and.callFake(() => q.resolve({}));
            spyOn(tasks, 'addModal').and.callFake(() => q.resolve({}));
            spyOn(contacts, 'bulkSave').and.callFake(() => q.resolve({}));
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
            rootScope.$apply();
        });

        it('should open next automation task if defined', (done) => {
            $ctrl.task.next_action = 'Call';
            $ctrl.save().then(() => {
                expect(tasks.addModal).toHaveBeenCalledWith({
                    contactsList: [1],
                    activityType: $ctrl.task.next_action,
                    task: $ctrl.task,
                    comments: []
                });
                done();
            });
            rootScope.$apply();
        });

        it('shouldn\'t open next automation task if None', (done) => {
            $ctrl.task.next_action = 'None';
            $ctrl.save().then(() => {
                expect(tasks.addModal).not.toHaveBeenCalled();
                done();
            });
            rootScope.$apply();
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

        it('should be false with null contactList', () => {
            $ctrl.task.contacts = null;
            expect($ctrl.showPartnerStatus()).toBeFalsy();
        });

        it('should be false without a task activity_type', () => {
            $ctrl.task.activity_type = null;
            expect($ctrl.showPartnerStatus()).toBeFalsy();
        });

        it('should be false when certain activity_types are set', () => {
            const arr = ['Pre Call Letter', 'Reminder Letter', 'Support Letter', 'Thank', 'To Do'];
            each((activity) => {
                $ctrl.task.activity_type = activity;
                expect($ctrl.showPartnerStatus()).toBeFalsy();
            }, arr);
        });
    });
});