import add from './bulkEdit.controller';
import { assign, each, map } from 'lodash/fp';

const selected = [1, 2];
const currentUser = { id: 321 };
const tags = [{ name: 'a' }, { name: 'b' }];

describe('tasks.bulkEdit.controller', () => {
    let $ctrl, controller, scope, api, tasksTags, tasks, users;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, _api_, _tasksTags_, _tasks_, _users_) => {
            scope = $rootScope.$new();
            api = _api_;
            tasks = _tasks_;
            tasksTags = _tasksTags_;
            users = _users_;
            users.current = currentUser;
            controller = $controller;
            $ctrl = loadController();
        });
    });

    function loadController() {
        return controller('bulkEditTaskController as $ctrl', {
            $scope: scope,
            selectedTasks: selected
        });
    }

    describe('bulkEdit', () => {
        beforeEach(() => {
            spyOn(api, 'put').and.callFake((url, data) => new Promise((resolve) => resolve(data)));
            spyOn(tasksTags, 'change').and.callFake(() => {});
            spyOn(tasks, 'change').and.callFake(() => {});
        });
        const model = { activity_type: 'activity' };
        it('should build a task from the provided model', (done) => {
            const result = map((id) => assign({ id: id }, model), selected);
            $ctrl.bulkEdit(model).then((data) => {
                expect(data).toEqual(result);
                expect(tasksTags.change).toHaveBeenCalled();
                done();
            });
            expect(api.put).toHaveBeenCalledWith('tasks/bulk', result);
        });
        it('should handle a comment', (done) => {
            const comment = 'comment';
            $ctrl.bulkEdit(model, comment).then((data) => {
                each((task) => {
                    expect(task.comments[0].body).toEqual(comment);
                    expect(task.comments[0].person.id).toEqual(currentUser.id);
                }, data);
                done();
            });
        });
        it('should handle tags', (done) => {
            $ctrl.bulkEdit(model, null, map('name', tags)).then((data) => {
                each((task) => {
                    expect(task.tag_list).toEqual('a,b');
                }, data);
                done();
            });
        });
    });
});