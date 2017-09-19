import component from './address.component';

describe('contacts.show.address.component', () => {
    let $ctrl, rootScope, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('contactAddress', { $scope: scope }, {});
    }
    describe('$onChanges', () => {
        beforeEach(() => {
            $ctrl.address = {
                street: '123 Street St',
                city: 'City',
                state: 'ST',
                postal_code: '12345'
            };
        });
        it('should build a google map link', () => {
            $ctrl.$onChanges();
            expect($ctrl.mapLink).toEqual('https://www.google.com/maps/search/?api=1&query=123 Street St, City, ST, 12345');
        });
        it('shouldn\'t be editable with a remote_id', () => {
            $ctrl.address.remote_id = true;
            $ctrl.address.source = 'MPDX';
            $ctrl.$onChanges();
            expect($ctrl.isEditable).toBeFalsy();
        });
        it('should be editable with source MPDX', () => {
            $ctrl.address.source = 'MPDX';
            $ctrl.$onChanges();
            expect($ctrl.isEditable).toBeTruthy();
        });
        it('should be editable with source manual', () => {
            $ctrl.address.source = 'manual';
            $ctrl.$onChanges();
            expect($ctrl.isEditable).toBeTruthy();
        });
        it('should be editable with source TntImport', () => {
            $ctrl.address.source = 'TntImport';
            $ctrl.$onChanges();
            expect($ctrl.isEditable).toBeTruthy();
        });
    });
});