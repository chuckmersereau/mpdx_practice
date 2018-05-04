import editController from './edit.controller';
import { isEqual } from 'lodash/fp';


describe('tasks.modals.edit.controller', () => {
    let $ctrl, controller, tasks, scope, q;
    beforeEach(() => {
        angular.mock.module(editController);
        inject(($controller, $rootScope, _tasks_, $q) => {
            scope = $rootScope.$new();
            scope.$hide = () => {};
            tasks = _tasks_;
            q = $q;
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
            spyOn(tasks, 'save').and.callFake(() => q.resolve());
            spyOn($ctrl, 'handleDates').and.callFake(() => {});
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

        it('should call handle Dates', (done) => {
            $ctrl.save().then(() => {
                expect($ctrl.handleDates).toHaveBeenCalledWith();
                done();
            });
            scope.$digest();
        });

        describe('promise successful', () => {
            it('should call $scope.hide', (done) => {
                spyOn(scope, '$hide').and.callThrough();
                $ctrl.save().then(() => {
                    expect(scope.$hide).toHaveBeenCalledWith();
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            spyOn(tasks, 'delete').and.callFake(() => q.resolve());
            $ctrl.task = { id: 'task_id' };
        });

        it('should call tasks.delete', () => {
            $ctrl.delete();
            expect(tasks.delete).toHaveBeenCalledWith($ctrl.task);
        });

        it('should return a promise', () => {
            expect($ctrl.delete()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should call $scope.hide', (done) => {
                spyOn(scope, '$hide').and.callThrough();
                $ctrl.delete().then(() => {
                    expect(scope.$hide).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
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
    describe('handleDates', () => {
        beforeEach(() => {
            spyOn($ctrl, 'isoDateOrNull').and.callFake(() => 'a');
        });
        it('should set start_at to iso date or null', () => {
            $ctrl.handleDates();
            expect($ctrl.task.start_at).toEqual('a');
        });
        it('should set completed_at to iso date or null', () => {
            $ctrl.handleDates();
            expect($ctrl.task.completed_at).toEqual('a');
        });
    });
    describe('isoDateOrNull', () => {
        it('should handle true', () => {
            spyOn($ctrl, 'isIsoDate').and.callFake(() => true);
            expect($ctrl.isoDateOrNull('a')).toEqual('a');
        });
        it('should handle false', () => {
            spyOn($ctrl, 'isIsoDate').and.callFake(() => false);
            expect($ctrl.isoDateOrNull('a')).toEqual(null);
        });
    });
    describe('isIsoDate', () => {
        it('should return true', () => {
            expect($ctrl.isIsoDate('2018-02-13T16:35:51Z')).toBeTruthy();
        });
        it('should handle false', () => {
            expect($ctrl.isIsoDate('a')).toBeFalsy();
        });
    });
});