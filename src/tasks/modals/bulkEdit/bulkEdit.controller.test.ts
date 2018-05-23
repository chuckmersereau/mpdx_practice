import { assign, each, isNil, map, omitBy } from 'lodash/fp';
import add from './bulkEdit.controller';

const selected = [1, 2];
const currentUser = { id: 321 };

describe('tasks.bulkEdit.controller', () => {
    let $ctrl, scope, api, tasks, users, q;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope, _api_, _tasks_, _users_, $q) => {
            scope = $rootScope.$new();
            api = _api_;
            tasks = _tasks_;
            users = _users_;
            q = $q;
            users.current = currentUser;
            $ctrl = $controller('bulkEditTaskController as $ctrl', {
                $scope: scope,
                selectedTasks: selected
            });
        });
    });

    describe('bulkEdit', () => {
        beforeEach(() => {
            spyOn(api, 'put').and.callFake((url, data) => q.resolve(data));
            spyOn(tasks, 'change').and.callFake(() => {});
        });
        const model = { activity_type: 'activity', no_date: null, start_at: null };
        it('should build a task from the provided model', (done) => {
            const result = map((id) => assign({ id: id }, omitBy(isNil, model)), selected);
            $ctrl.bulkEdit(model).then((data) => {
                expect(data).toEqual(result);
                done();
            });
            expect(api.put).toHaveBeenCalledWith('tasks/bulk', result);
            scope.$digest();
        });

        it('should set start_at to nil if no_date is set', (done) => {
            model.no_date = true;
            let modifiedModel = angular.copy(model);
            modifiedModel.start_at = null;
            const result = map((id) => assign({ id: id }, modifiedModel), selected);
            $ctrl.bulkEdit(model).then((data) => {
                expect(data).toEqual(result);
                done();
            });
            expect(api.put).toHaveBeenCalledWith('tasks/bulk', result);
            scope.$digest();
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
            scope.$digest();
        });
    });
});
