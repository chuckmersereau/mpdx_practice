import component from './drawer.component';

describe('tasks.list.drawer.component', () => {
    let $ctrl, rootScope, scope, componentController, users, api, tasks, alerts;

    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _api_, _users_, _tasks_, _alerts_
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            tasks = _tasks_;
            users = _users_;
            componentController = $componentController;
            loadController();
        });
        spyOn(alerts, 'addAlert').and.callFake(() => {});
        spyOn($ctrl, 'gettext').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('taskItemDrawer', { $scope: scope }, { task: null, selected: null });
    }
    describe('constructor', () => {
        it('should set loaded to false', () => {
            expect($ctrl.loaded).toBeFalsy();
        });
    });
    describe('$onChanges', () => {
        it('shouldn\'t load task if same id', () => {
            spyOn(tasks, 'load').and.callFake(() => Promise.resolve());
            $ctrl.task = { id: 1 };
            $ctrl.$onChanges({ task: { previousValue: { id: 1 } } });
            expect(tasks.load).not.toHaveBeenCalled();
        });
        it('should load task if new', () => {
            spyOn(tasks, 'load').and.callFake(() => Promise.resolve());
            $ctrl.task = { id: 1 };
            $ctrl.$onChanges({ task: { previousValue: { id: 2 } } });
            expect(tasks.load).toHaveBeenCalledWith(1);
        });
        it('should set task', (done) => {
            const retVal = { id: 2 };
            spyOn(tasks, 'load').and.callFake(() => Promise.resolve(retVal));
            $ctrl.task = { id: 1 };
            $ctrl.$onChanges({ task: { previousValue: { id: 2 } } }).then(() => {
                expect($ctrl.task).toEqual(retVal);
                done();
            });
        });
        it('should set loaded to true', (done) => {
            spyOn(tasks, 'load').and.callFake(() => Promise.resolve({}));
            $ctrl.task = { id: 1 };
            $ctrl.$onChanges({ task: { previousValue: { id: 2 } } }).then(() => {
                expect($ctrl.loaded).toBeTruthy();
                done();
            });
        });
        it('should initially set loading to false', () => {
            spyOn(tasks, 'load').and.callFake(() => Promise.resolve());
            $ctrl.task = { id: 1 };
            $ctrl.$onChanges({ task: { previousValue: { id: 2 } } });
            expect($ctrl.loaded).toBeFalsy();
        });
        it('should handle failure', (done) => {
            spyOn(tasks, 'load').and.callFake(() => Promise.reject({}));
            $ctrl.task = { id: 1 };
            $ctrl.$onChanges({ task: { previousValue: { id: 2 } } }).then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Unable to load requested task', 'danger');
                expect($ctrl.gettext).toHaveBeenCalledWith('Unable to load requested task');
                done();
            });
        });
    });
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
