import add from './add.controller';

let contactList = [];
const defaultTask = {
    start_at: null
};

describe('tasks.modals.add.controller', () => {
    let $ctrl, controller, tasks, scope, rootScope;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, _tasks_, _users_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            tasks = _tasks_;
            controller = $controller;
            _users_.current = { id: 234 };
            $ctrl = loadController();
        });
    });

    function loadController(task = defaultTask) {
        return controller('addTaskController as $ctrl', {
            $scope: scope,
            resolveObject: {
                contactsList: contactList,
                task: task
            }
        });
    }
    describe('save', () => {
        beforeEach(() => {
            spyOn(tasks, 'create').and.callFake(() => Promise.resolve({}));
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
        });
        it('should hide the modal when finished', (done) => {
            $ctrl.save().then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
    });
});