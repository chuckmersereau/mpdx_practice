import component from './drawer.component';

describe('tasks.list.drawer.component', () => {
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
        $ctrl = componentController('taskItemDrawer', { $scope: scope }, { task: null, selected: null });
    }
    describe('addComment', () => {
        beforeEach(() => {
            $ctrl.task = { id: 1 };
            users.current = { id: 2, first_name: 'a', last_name: 'b' };
            $ctrl.task.comments = [];
            spyOn(api, 'post').and.callFake(() => Promise.resolve({ id: 1, body: 'asdf' }));
        });
        it('should do nothing without a comment', () => {
            expect($ctrl.addComment()).toBeUndefined();
        });
        it('should post to the api', () => {
            $ctrl.comment = 'asdf';
            $ctrl.addComment();
            expect(api.post).toHaveBeenCalledWith('tasks/1/comments', { body: 'asdf', person: { id: 2 } });
        });
        it('should adjust the current results', (done) => {
            $ctrl.comment = 'asdf';
            $ctrl.addComment().then(() => {
                expect($ctrl.task.comments).toEqual([{ id: 1, body: 'asdf', person: { id: 2, first_name: 'a', last_name: 'b' } }]);
                done();
            });
        });
        it('should reset the comment box', (done) => {
            $ctrl.comment = 'asdf';
            $ctrl.addComment().then(() => {
                expect($ctrl.comment).toEqual('');
                done();
            });
        });
    });
    describe('commentRemoved', () => {
        it('should remove the comment from the task', () => {
            $ctrl.task = { id: 1, comments: [{ id: 1 }, { id: 2 }] };
            $ctrl.commentRemoved(1);
            expect($ctrl.task.comments.length).toEqual(1);
            expect($ctrl.task.comments[0].id).toEqual(2);
        });
    });
});
