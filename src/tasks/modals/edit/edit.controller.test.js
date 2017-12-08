import editController from './edit.controller';
import isEqual from 'lodash/fp/isEqual';


describe('tasks.modals.edit.controller', () => {
    let $ctrl, controller, tasks, scope;
    beforeEach(() => {
        angular.mock.module(editController);
        inject(($controller, $rootScope, _tasks_) => {
            scope = $rootScope.$new();
            scope.$hide = () => {};
            tasks = _tasks_;
            controller = $controller;

            $ctrl = loadController();
        });
    });

    function loadController(task = {}) {
        return controller('editTaskController as $ctrl', {
            $scope: scope,
            task: task
        });
    }

    describe('constructor', () => {
        it('should clone the task', () => {
            expect(isEqual($ctrl.task, { })).toBeTruthy();
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'save').and.callFake(() => Promise.resolve());
        });

        it('should call tasks.save', () => {
            let task = {
                abc: 123,
                def: 456
            };
            $ctrl.taskInitialState = angular.copy(task);
            $ctrl.task = angular.copy(task);
            $ctrl.task.change = '789';
            $ctrl.save();
            expect(tasks.save).toHaveBeenCalledWith({
                activity_contacts: [],
                change: '789',
                notification_type: null,
                contacts: []
            });
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call $scope.hide', (done) => {
                spyOn(scope, '$hide').and.callThrough();
                $ctrl.save().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            spyOn(tasks, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.task = { id: 'task_id' };
        });

        it('should call tasks.delete', () => {
            $ctrl.delete();
            expect(tasks.delete).toHaveBeenCalledWith($ctrl.task);
        });

        it('should return a promise', () => {
            expect($ctrl.delete()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call $scope.hide', (done) => {
                spyOn(scope, '$hide').and.callThrough();
                $ctrl.delete().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
            });
        });
    });
    describe('handleActivityContacts', () => {
        it('should handle contact addition and removal', () => {
            $ctrl.task.contacts = [{ id: 1 }, { id: 2 }];
            $ctrl.task.activity_contacts = [{ contact: { id: 1 } }, { contact: { id: 3 } }];
            $ctrl.handleActivityContacts();
            expect($ctrl.task.contacts).toEqual([{ id: 2 }]);
            expect($ctrl.task.activity_contacts).toEqual([{ contact: { id: 1 } }, { contact: { id: 3 }, _destroy: 1 }]);
        });
    });
});
