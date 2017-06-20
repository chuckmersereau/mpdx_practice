import component from './connect.component';

describe('home.connect', () => {
    let $ctrl, componentController, scope, rootScope, tasks, serverConstants;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _tasks_, _serverConstants_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            tasks = _tasks_;
            serverConstants = _serverConstants_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('homeConnect', {$scope: scope});
    }
    describe('totalTasks', () => {
        it('should return 0 by default', () => {
            expect($ctrl.totalTasks()).toEqual(0);
        });
        it('should return 0 if partially undefined', () => {
            tasks.analytics = {};
            expect($ctrl.totalTasks()).toEqual(0);
        });
        it('should return sum', () => {
            tasks.analytics = {tasks_overdue_or_due_today_counts: [{count: 1}, {count: 2}]};
            expect($ctrl.totalTasks()).toEqual(3);
        });
    });
    describe('totalTypes', () => {
        it('should return 0 by default', () => {
            expect($ctrl.totalTypes()).toEqual(0);
        });
        it('should return 0 if partially undefined', () => {
            tasks.analytics = {};
            expect($ctrl.totalTypes()).toEqual(0);
        });
        it('should return sum', () => {
            tasks.analytics = {tasks_overdue_or_due_today_counts: [{count: 1}, {count: 2}]};
            expect($ctrl.totalTypes()).toEqual(2);
        });
    });
    describe('getTranslatedLabel', () => {
        it('should return label by default', () => {
            serverConstants.data = {};
            expect($ctrl.getTranslatedLabel('a')).toEqual('a');
        });
        it('should return label if partially undefined', () => {
            serverConstants.data = {activity_hashes: [{id: 'b'}]};
            expect($ctrl.getTranslatedLabel('a')).toEqual('a');
        });
        it('should return translated value', () => {
            serverConstants.data = {activity_hashes: [{id: 'a', value: 'b'}]};
            expect($ctrl.getTranslatedLabel('a')).toEqual('b');
        });
    });
});