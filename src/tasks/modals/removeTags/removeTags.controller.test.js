import remove from './removeTags.controller';
import assign from 'lodash/fp/assign';


describe('tasks.modals.removeTags.controller', () => {
    let $ctrl, controller, tasksTags, scope, rootScope, api, modal, gettextCatalog, alerts;
    function defaultScope() {
        return {
            $scope: scope,
            selectedTasks: [{ id: 1, tag_list: ['b'] }, { id: 2, tag_list: ['a'] }],
            currentListSize: 25
        };
    }
    beforeEach(() => {
        angular.mock.module(remove);
        inject(($controller, $rootScope, _tasksTags_, _api_, _modal_, _gettextCatalog_, _alerts_) => {
            rootScope = $rootScope.$new();
            scope = rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            api.account_list_id = 123;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            tasksTags = _tasksTags_;
            tasksTags.data = [{ name: 'b' }, { name: 'c' }];
            controller = $controller;
            $ctrl = loadController(defaultScope());
        });
    });
    function loadController(scope) {
        return controller('removeTaskTagController as $ctrl', scope);
    }
    describe('removeTag', () => {
        beforeEach(() => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve({}));
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve({}));
            spyOn(gettextCatalog, 'getString').and.callFake(data => data);
            spyOn(alerts, 'addAlert').and.callFake(data => data);
            scope.$hide = () => {};
            spyOn(scope, '$hide').and.callThrough();
        });
        it('should confirm with a translated message', () => {
            $ctrl.removeTag('a');
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
        });
        it('should remove a tag from selected contacts', done => {
            $ctrl.removeTag('a').then(() => {
                expect(api.delete).toHaveBeenCalledWith({
                    url: 'tasks/tags/bulk',
                    data: [{
                        filter: {
                            account_list_id: api.account_list_id,
                            task_ids: '1,2'
                        },
                        name: 'a'
                    }],
                    type: 'tags'
                });
                done();
            });
        });
        it('should alert the user on successful removal', done => {
            $ctrl.removeTag('a').then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString.calls.argsFor(1)[0]).toEqual(jasmine.any(String));
                done();
            });
        });
        it('should hide the modal', done => {
            $ctrl.removeTag('a').then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
    });
    describe('getTagsFromSelectedTasks', () => {
        it('should show a sorted list of tags', () => {
            expect($ctrl.getTagsFromSelectedTasks()).toEqual(['a', 'b']);
        });
        it('should show a complete list of tags if selected > data', () => {
            $ctrl = loadController(assign(defaultScope(), { currentListSize: 1 }));
            expect($ctrl.getTagsFromSelectedTasks()).toEqual(['b', 'c']);
        });
    });
});