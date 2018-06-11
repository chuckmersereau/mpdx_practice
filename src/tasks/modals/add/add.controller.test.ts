import add from './add.controller';

let contactList = [];
const defaultTask = {
    start_at: null
};

describe('tasks.modals.add.controller', () => {
    let $ctrl, tasks, scope, rootScope, q;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, _tasks_, _users_, $q) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            tasks = _tasks_;
            q = $q;
            _users_.current = { id: 234 };
            $ctrl = $controller('addTaskController as $ctrl', {
                $scope: scope,
                resolveObject: {
                    contactsList: contactList,
                    task: defaultTask
                }
            });
        });
    });

    describe('constructor', () => {
        it('should handle start_at removing a value', () => {
            $ctrl.task.start_at = '2018-02-28T15:25:47Z';
            scope.$digest();
            $ctrl.task.start_at = null;
            scope.$digest();
            expect($ctrl.task.notification_time_before).toEqual(null);
            expect($ctrl.task.notification_type).toEqual(null);
        });

        it('should handle notification_time_before adding a value', () => {
            $ctrl.task.notification_time_before = null;
            scope.$digest();
            $ctrl.task.notification_time_before = 1;
            scope.$digest();
            expect($ctrl.task.notification_type).toEqual('both');
        });

        it('should handle notification_time_before removing a value', () => {
            $ctrl.task.notification_time_before = 1;
            scope.$digest();
            $ctrl.task.notification_time_before = null;
            scope.$digest();
            expect($ctrl.task.notification_type).toEqual(null);
        });

        it('should call watchers on destroy', () => {
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            scope.$emit('$destroy');
            scope.$digest();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'create').and.callFake(() => q.resolve({}));
            scope.$hide = () => {};
            spyOn(scope, '$hide').and.callThrough();
            spyOn(rootScope, '$emit').and.callFake(() => {});
        });

        it('should create a task', () => {
            $ctrl.save();
            expect(tasks.create).toHaveBeenCalledWith($ctrl.task, $ctrl.contactsList, $ctrl.comment);
        });

        it('should emit when finished', (done) => {
            $ctrl.save().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('taskAdded');
                done();
            });
            scope.$digest();
        });

        it('should hide the modal when finished', (done) => {
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
    });
});