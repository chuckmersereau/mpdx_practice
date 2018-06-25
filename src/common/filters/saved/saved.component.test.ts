import component, { strReplace } from './saved.component';

const accountListId = 123;
const type = 'tasks';
const name = 'my_filter';
const key = `saved_${type}_filter_${name}`;
const options = {
    [key]: { key: key, title: key, value: `"account_list_id":"${accountListId}"` }
};
const data = 'a';

describe('common.filters.saved.component', () => {
    let $ctrl, componentController, scope, rootScope, users, api, gettextCatalog, modal, q;

    function loadController() {
        $ctrl = componentController('savedFilters', { $scope: scope }, {
            type: type
        });
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _users_, _api_, _gettextCatalog_, _modal_, $q) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            users = _users_;
            q = $q;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        api.account_list_id = accountListId;
        $ctrl.start = `saved_${type}_filter_`;
    });

    describe('$onInit', () => {
        beforeEach(() => {
            $ctrl.savedFilterNames = ['a'];
            spyOn($ctrl, 'getSavedFilters').and.callFake(() => {});
            spyOn(users, 'getCurrentOptionValue').and.callFake(() => true);
            spyOn(users, 'saveOption').and.callFake(() => q.resolve());
        });

        afterEach(() => {
            $ctrl.$onDestroy();
        });

        it('should set a prefix', () => {
            $ctrl.$onInit();
            expect($ctrl.start).toEqual(`saved_${type}_filter_`);
        });

        it('should call getSavedFilters', () => {
            $ctrl.$onInit();
            expect($ctrl.getSavedFilters).toHaveBeenCalledWith();
        });

        it('should handle savedFilterAdded', () => {
            $ctrl.$onInit();
            rootScope.$emit('savedFilterAdded', `${$ctrl.start}${name}`);
            rootScope.$digest();
            expect($ctrl.savedFilterNames).toEqual([data, name]);
        });

        it('should handle accountListUpdated', () => {
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated', `${$ctrl.start}${name}`);
            rootScope.$digest();
            expect($ctrl.getSavedFilters).toHaveBeenCalledWith();
        });

        it('should set isCollapsed', () => {
            $ctrl.$onInit();
            expect($ctrl.isCollapsed).toBeTruthy();
        });

        it('should handle isCollapsed changing', () => {
            $ctrl.$onInit();
            $ctrl.isCollapsed = false;
            rootScope.$digest();
            expect(users.saveOption).toHaveBeenCalledWith('saved_tasks_filter_collapse', false);
        });
    });

    describe('$onDestroy', () => {
        it('should clear watchers', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            spyOn($ctrl, 'watcher3').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
            expect($ctrl.watcher3).toHaveBeenCalledWith();
        });
    });

    describe('getSavedFilters', () => {
        it('should get saved filters', () => {
            users.currentOptions = options;
            $ctrl.getSavedFilters();
            expect($ctrl.savedFilterNames).toEqual([name]);
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
            spyOn(users, 'deleteOption').and.callFake(() => q.resolve());
        });

        it('should translate a confirm message', () => {
            $ctrl.remove(name);
            expect(gettextCatalog.getString).toHaveBeenCalledWith('Are you sure you wish to delete the saved filter "{{ name }}"?', { name: 'my filter' });
        });

        it('should confirm message', () => {
            $ctrl.remove(name);
            expect(modal.confirm).toHaveBeenCalledWith('Are you sure you wish to delete the saved filter "my filter"?');
        });

        it('should delete on confirm', (done) => {
            $ctrl.savedFilterNames = [key];
            $ctrl.remove(name).then(() => {
                expect(users.deleteOption).toHaveBeenCalledWith(key);
                done();
            });
            rootScope.$digest();
        });

        it('should pull key from the list', (done) => {
            $ctrl.start = `saved_${type}_filter_`;
            $ctrl.savedFilterNames = [name];
            $ctrl.remove(name).then(() => {
                expect($ctrl.savedFilterNames).toEqual([]);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('strReplace', () => {
        it('should replace all instances of a string in a string', () => {
            expect(strReplace()('a_b_c', '_', ' ')).toEqual('a b c');
        });
    });
});
