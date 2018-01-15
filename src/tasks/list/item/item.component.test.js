import component from './item.component';

describe('tasks.list.item.component', () => {
    let $ctrl, contacts, rootScope, scope, componentController, modal, tasks, gettextCatalog, users, api,
        serverConstants;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _contacts_, _modal_, _tasks_, _gettextCatalog_, _users_, _api_,
            _serverConstants_
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            users = _users_;
            contacts = _contacts_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            tasks = _tasks_;
            serverConstants = _serverConstants_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('tasksListItem', { $scope: scope }, { task: null, selected: null });
    }
    describe('constructor', () => {
        beforeEach(() => {
            spyOn(contacts, 'clearSelectedContacts').and.callFake(() => {});
        });
        it('should expose dependencies', () => {
            expect($ctrl.gettextCatalog).toEqual(gettextCatalog);
            expect($ctrl.modal).toEqual(modal);
            expect($ctrl.tasks).toEqual(tasks);
            expect($ctrl.users).toEqual(users);
        });
    });
    describe('$onInit', () => {
        it('should set default values', () => {
            $ctrl.$onInit();
            expect($ctrl.showContacts).toBeFalsy();
            expect($ctrl.showComments).toBeFalsy();
            expect($ctrl.loaded).toBeFalsy();
            $ctrl.$onDestroy();
        });
        it('should handle tag deletion', () => {
            $ctrl.task = { id: 1, tag_list: ['a', 'b'] };
            $ctrl.$onInit();
            rootScope.$emit('taskTagDeleted', { taskIds: [1], tag: 'a' });
            rootScope.$digest();
            expect($ctrl.task.tag_list).toEqual(['b']);
            $ctrl.$onDestroy();
        });
        it('should ignore other task ids', () => {
            $ctrl.task = { id: 1, tag_list: ['a', 'b'] };
            $ctrl.$onInit();
            rootScope.$emit('taskTagDeleted', { taskIds: [2], tag: 'a' });
            rootScope.$digest();
            expect($ctrl.task.tag_list).toEqual(['a', 'b']);
            $ctrl.$onDestroy();
        });
    });
    describe('complete', () => {
        it('should open the complete modal', () => {
            spyOn(modal, 'open').and.callThrough();
            spyOn(serverConstants, 'load').and.callFake(() => Promise.resolve());
            spyOn(tasks, 'load').and.callFake(() => Promise.resolve());
            $ctrl.task = { id: 1 };
            $ctrl.complete();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../../modals/complete/complete.html'),
                controller: 'completeTaskController',
                resolve: jasmine.any(Object)
            });
            expect(tasks.load).toHaveBeenCalledWith(1);
            expect(serverConstants.load).toHaveBeenCalledWith(['next_actions', 'results', 'status_hashes']);
        });
    });
    describe('edit', () => {
        it('should open the edit modal', () => {
            spyOn(modal, 'open').and.callThrough();
            spyOn(serverConstants, 'load').and.callFake(() => Promise.resolve());
            $ctrl.task = { id: 1 };
            $ctrl.edit();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../../modals/edit/edit.html'),
                controller: 'editTaskController',
                locals: jasmine.any(Object),
                resolve: jasmine.any(Object)
            });
            expect(serverConstants.load).toHaveBeenCalledWith(['activity_hashes', 'results']);
        });
    });
    describe('star', () => {
        it('should call the api', (done) => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve({ starred: true }));
            $ctrl.task = { id: 1, starred: false };
            $ctrl.star().then(() => {
                expect(api.put).toHaveBeenCalledWith('tasks/1', {
                    id: 1,
                    starred: true
                });
                expect($ctrl.task.starred).toBeTruthy();
                done();
            });
        });
    });
});
