import component from './tags.component';

describe('tasks.tags', () => {
    let $ctrl, rootScope, scope, users, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $q, _users_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            q = $q;
            users = _users_;
            $ctrl = $componentController('tasksTags', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should define default values', () => {
            expect($ctrl.hideTags).toEqual(true);
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(users, 'getCurrentOptionValue').and.callFake(() => true);
            spyOn(users, 'saveOption').and.callFake(() => q.resolve());
        });

        afterEach(() => {
            $ctrl.$onDestroy();
        });

        it('should set isCollapsed', () => {
            $ctrl.$onInit();
            expect($ctrl.isCollapsed).toBeTruthy();
        });

        it('should handle isCollapsed changing', () => {
            $ctrl.$onInit();
            $ctrl.isCollapsed = false;
            rootScope.$digest();
            expect(users.saveOption).toHaveBeenCalledWith('tasks_tags_collapse', false);
        });
    });

    describe('$onDestroy', () => {
        it('should clear watchers', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
        });
    });
});
