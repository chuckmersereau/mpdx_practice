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
            expect(isEqual($ctrl.task, { contacts: [] })).toBeTruthy();
        });

        it('should set noDate to true', () => {
            expect($ctrl.noDate).toEqual(true);
        });

        describe('start_at set', () => {
            beforeEach(() => {
                $ctrl = loadController({ start_at: '123' });
            });

            it('should set noDate to false', () => {
                expect($ctrl.noDate).toEqual(false);
            });
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'save').and.callFake(() => Promise.resolve());
        });

        describe('noDate is true', () => {
            beforeEach(() => {
                $ctrl.task.start_at = '123';
                $ctrl.noDate = true;
            });

            it('should set start_at to null', () => {
                $ctrl.save();
                expect($ctrl.task.start_at).toEqual(null);
            });
        });

        it('should remove all empty contacts from task.contacts', () => {
            $ctrl.task.contacts = [{ id: '123' }, {}, null];
            $ctrl.save();
            expect($ctrl.task.contacts).toEqual([{ id: '123' }]);
        });

        it('should call tasks.save', () => {
            let task = {
                abc: 123,
                def: 456
            };
            $ctrl.comment = 'hello world';
            $ctrl.taskInitialState = angular.copy(task);
            $ctrl.task = angular.copy(task);
            $ctrl.task.change = '789';
            $ctrl.save();
            expect(tasks.save).toHaveBeenCalledWith({
                change: '789',
                start_at: null,
                contacts: []
            }, 'hello world');
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

    describe('addContact', () => {
        it('should add empty object to contacts', () => {
            $ctrl.addContact();
            expect($ctrl.task.contacts).toEqual([{}]);
        });
    });

    describe('setContact', () => {
        it('should set contacts(index) to contact', () => {
            $ctrl.task.contacts = [{}, {}];
            $ctrl.setContact({ id: 'contact_id' }, 1);
            expect($ctrl.task.contacts).toEqual([{}, { id: 'contact_id' }]);
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
});
