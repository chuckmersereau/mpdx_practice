import component from './address.component';

describe('contacts.show.address.component', () => {
    let $ctrl, contacts, rootScope, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            contacts = _contacts_;
            componentController = $componentController;
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController('contactAddress', {$scope: scope}, {});
    }
    describe('$onChanges', () => {
        it('should build a google map link', () => {
            $ctrl.address = {
                street: '123 Street St',
                city: 'City',
                state: 'ST',
                postal_code: '12345'
            };
            $ctrl.$onChanges();
            expect($ctrl.mapLink).toEqual('https://www.google.com/maps/search/?api=1&query=123 Street St, City, ST, 12345');
        });
    });
});