import component from './show.component';

describe('contacts.show.component', () => {
    let $ctrl, contacts, rootScope, scope, componentController, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _contactsTags_, _modal_, _tasks_, _alerts_, _gettextCatalog_, _api_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            contacts = _contacts_;
            componentController = $componentController;
            api.account_list_id = 1234;
            contacts.current = {id: 1};
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController('contact', {$scope: scope}, {});
    }
    describe('onPrimary', () => {
        beforeEach(() => {
            spyOn($ctrl, 'save').and.callFake(() => {});
        });
        it(`should return if personId isn't set`, () => {
            const initialValue = angular.copy(contacts.current.primary_person);
            $ctrl.onPrimary();
            expect(contacts.current.primary_person).toEqual(initialValue);
            expect($ctrl.save).not.toHaveBeenCalled();
        });
        it(`should return if personId is already the same value`, () => {
            contacts.current.primary_person = {id: 1};
            const initialValue = angular.copy(contacts.current.primary_person);
            $ctrl.onPrimary(1);
            expect(contacts.current.primary_person).toEqual(initialValue);
            expect($ctrl.save).not.toHaveBeenCalled();
        });
        it('should set the primary person', () => {
            contacts.current = {id: 1};
            $ctrl.onPrimary(1);
            expect($ctrl.save).toHaveBeenCalled();
            expect(contacts.current.primary_person.id).toEqual(1);
        });
    });
});