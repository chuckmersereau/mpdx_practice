import component from './add.component';

const defaultTask = { subject: 'a' };
describe('tasks.list.add.component', () => {
    let $ctrl, rootScope, scope, componentController, tasks, contacts, state;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _tasks_, _contacts_, $state) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            contacts = _contacts_;
            contacts.current = { id: 1 };
            state = $state;
            tasks = _tasks_;
            componentController = $componentController;
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController('tasksListAdd', { $scope: scope }, {});
    }
    describe('constructor', () => {
        it('should set task to an empty model', () => {
            expect($ctrl.task).toEqual({});
        });
    });
    describe('save', () => {
        beforeEach(() => {
            $ctrl.task = defaultTask;
            spyOn(tasks, 'create').and.callFake(() => {});
        });
        it('should set task to an empty model', () => {
            $ctrl.save();
            expect($ctrl.task).toEqual({});
        });
        it('should create a task', () => {
            $ctrl.save();
            expect(tasks.create).toHaveBeenCalledWith(defaultTask, null);
        });
        it('should add the current contact if in contact show', () => {
            state.current.name = 'contacts.show';
            $ctrl.save();
            expect(tasks.create).toHaveBeenCalledWith(defaultTask, [1]);
        });
    });
});