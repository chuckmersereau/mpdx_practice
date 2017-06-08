import component from './birthdays.component';

describe('home.care.birthdays', () => {
    let $ctrl, contacts, locale, rootScope, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _locale_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            contacts = _contacts_;
            locale = _locale_;
            componentController = $componentController;
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController('birthdays', {$scope: scope}, {});
    }
    describe('constructor', () => {
        it('should expose dependencies for view', () => {
            expect($ctrl.contacts).toEqual(contacts);
            expect($ctrl.locale).toEqual(locale);
        });
        it('should set a limit for display', () => {
            expect($ctrl.limit).toEqual(5);
        });
    });
});