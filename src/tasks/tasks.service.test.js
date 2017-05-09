import service from './tasks.service';
import assign from 'lodash/fp/assign';
import each from 'lodash/fp/each';
import map from 'lodash/fp/map';

const accountListId = 123;
const tags = [{name: 'a'}, {name: 'b'}];
const selected = [1, 2];
const currentUser = {id: 321};

describe('tasks.service', () => {
    let api, users, tasks, tasksTags;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _tasks_, _tasksTags_, _users_) => {
            api = _api_;
            users = _users_;
            tasks = _tasks_;
            tasksTags = _tasksTags_;
            api.account_list_id = accountListId;
            users.current = currentUser;
        });
    });
    describe('bulkEdit', () => {
        beforeEach(() => {
            tasks.selected = selected;
            spyOn(api, 'put').and.callFake((url, data) => new Promise(resolve => resolve(data)));
            spyOn(tasksTags, 'change').and.callFake(() => {});
            spyOn(tasks, 'change').and.callFake(() => {});
        });
        const model = {activity_type: 'activity'};
        it('should build a task from the provided model', (done) => {
            const result = map(id => assign({id: id}, model), selected);
            tasks.bulkEdit(model).then(data => {
                expect(data).toEqual(result);
                expect(tasksTags.change).toHaveBeenCalled();
                expect(tasks.change).toHaveBeenCalled();
                done();
            });
            expect(api.put).toHaveBeenCalledWith('tasks/bulk', result);
        });
        it('should handle a comment', (done) => {
            const comment = 'comment';
            tasks.bulkEdit(model, comment).then(data => {
                each(task => {
                    expect(task.comments[0].body).toEqual(comment);
                    expect(task.comments[0].person.id).toEqual(currentUser.id);
                }, data);
                done();
            });
        });
        it('should handle tags', (done) => {
            tasks.bulkEdit(model, null, map('name', tags)).then(data => {
                each(task => {
                    expect(task.tag_list).toEqual('a,b');
                }, data);
                done();
            });
        });
    });
});