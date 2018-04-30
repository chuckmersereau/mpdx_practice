import component from './locale.component';

describe('preferences.personal.locale.component', () => {
    let $ctrl, locale, rootScope, scope, componentController, serverConstants, users, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _locale_, _users_, _serverConstants_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            locale = _locale_;
            users = _users_;
            serverConstants = _serverConstants_;
            q = $q;
            componentController = $componentController;
            serverConstants.data = { languages: [] };
            users.current = { preferences: { locale_display: null } };
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController(
            'preferencesPersonalLocale',
            { $scope: scope },
            { onSave: () => q.resolve() });
    }
    describe('$onChanges', () => {
        it('should set locale_display', () => {
            spyOn(locale, 'getLocalesMap').and.callFake(() => [{ alias: 'en', value: 'english' }]);
            $ctrl.$onChanges();
            expect(users.current.preferences.locale_display).toEqual('en');
        });
        it('should set locale_display', () => {
            users.current.preferences.locale_display = 'nz';
            spyOn(locale, 'getLocalesMap').and.callFake(() => [{ alias: 'en', value: 'english' }]);
            $ctrl.$onChanges();
            expect(users.current.preferences.locale_display).toEqual('en');
        });
        it('should set locale_display', () => {
            users.current.preferences.locale_display = 'nz';
            spyOn(locale, 'getLocalesMap').and.callFake(() => [{ alias: 'nz', value: 'nz english' }]);
            $ctrl.$onChanges();
            expect(users.current.preferences.locale_display).toEqual('nz');
        });
    });
    describe('setLocale', () => {
        it('should call locale change', () => {
            users.current.preferences.locale_display = 'en';
            spyOn(locale, 'change').and.callFake(() => {});
            $ctrl.setLocale();
            expect(locale.change).toHaveBeenCalledWith('en');
        });
    });
});
