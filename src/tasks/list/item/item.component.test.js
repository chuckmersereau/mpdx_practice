import component from './item.component';

describe('tasks.list.item.component', () => {
    let $ctrl, contacts, rootScope, scope, componentController, modal, tasks, locale, gettextCatalog, users;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _modal_, _tasks_, _locale_, _gettextCatalog_, _users_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            locale = _locale_;
            users = _users_;
            contacts = _contacts_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            tasks = _tasks_;
            componentController = $componentController;
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController('tasksListItem', {$scope: scope}, {task: null, selected: null});
    }
    describe('constructor', () => {
        beforeEach(() => {
            spyOn(contacts, 'clearSelectedContacts').and.callFake(() => {});
        });
        it('should expose dependencies', () => {
            expect($ctrl.gettextCatalog).toEqual(gettextCatalog);
            expect($ctrl.locale).toEqual(locale);
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
        });
    });
    describe('commentBelongsToUser', () => {
        it('should be true if comment belongs to current user', () => {
            users.current = {id: 1};
            const comment = {person: {id: 1}};
            expect($ctrl.commentBelongsToUser(comment)).toBeTruthy();
        });
        it('should be false if comment belongs to different user', () => {
            users.current = {id: 1};
            const comment = {person: {id: 2}};
            expect($ctrl.commentBelongsToUser(comment)).toBeFalsy();
        });
        it('should be false if null condition', () => {
            users.current = {id: 1};
            const comment = {};
            expect($ctrl.commentBelongsToUser(comment)).toBeFalsy();
        });
    });
});
