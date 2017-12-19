import component from './comment.component';

describe('tasks.list.item.component', () => {
    let $ctrl, rootScope, scope, componentController, modal, users, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _modal_, _users_, _api_
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            users = _users_;
            modal = _modal_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('taskItemComment', { $scope: scope }, { taskId: 1, comment: {}, onCommentRemove: () => {} });
    }
    describe('constructor', () => {
        it('should expose dependencies', () => {
            expect($ctrl.modal).toEqual(modal);
            expect($ctrl.users).toEqual(users);
        });
    });
    describe('editComment', () => {
        beforeEach(() => {
            $ctrl.taskId = 1;
            $ctrl.comment = { id: 3, body: 'asdf', person: { id: 2, first_name: 'a', last_name: 'b' } };
            users.current = { id: 2, first_name: 'a', last_name: 'b' };
            spyOn(api, 'put').and.callFake(() => Promise.resolve({ id: 1, body: 'asdf' }));
        });
        it('should put to the api', () => {
            $ctrl.editComment();
            expect(api.put).toHaveBeenCalledWith('tasks/1/comments/3', { body: 'asdf' });
        });
        it('should reset the comment edit flag', (done) => {
            $ctrl.editComment().then(() => {
                expect($ctrl.comment.edit).toBeFalsy();
                done();
            });
        });
    });
    describe('commentBelongsToUser', () => {
        it('should be true if comment belongs to current user', () => {
            users.current = { id: 1 };
            const comment = { person: { id: 1 } };
            expect($ctrl.commentBelongsToUser(comment)).toBeTruthy();
        });
        it('should be false if comment belongs to different user', () => {
            users.current = { id: 1 };
            const comment = { person: { id: 2 } };
            expect($ctrl.commentBelongsToUser(comment)).toBeFalsy();
        });
        it('should be false if null condition', () => {
            users.current = { id: 1 };
            const comment = {};
            expect($ctrl.commentBelongsToUser(comment)).toBeFalsy();
        });
    });
    describe('deleteComment', () => {
        beforeEach(() => {
            $ctrl.taskId = 1;
            $ctrl.comment = { id: 2 };
            spyOn($ctrl, 'gettext').and.callFake(() => 'a');
            spyOn($ctrl, 'onCommentRemove').and.callFake(() => {});
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
        });
        it('should open a translated confirm dialog', () => {
            $ctrl.deleteComment();
            expect($ctrl.gettext)
                .toHaveBeenCalledWith('Are you sure you wish to delete the selected comment?');
            expect(modal.confirm).toHaveBeenCalledWith('a');
        });
        it('should delete the comment', (done) => {
            $ctrl.deleteComment().then(() => {
                expect(api.delete).toHaveBeenCalledWith('tasks/1/comments/2');
                expect($ctrl.onCommentRemove).toHaveBeenCalledWith();
                done();
            });
        });
    });
});
