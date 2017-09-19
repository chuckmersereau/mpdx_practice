import modal from './modal.controller';

describe('contacts.show.address.modal.controller', () => {
    let $ctrl, controller, scope, NgMap, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(modal);
        inject(($controller, $rootScope, _NgMap_, _gettextCatalog_) => {
            scope = $rootScope.$new();
            NgMap = _NgMap_;
            gettextCatalog = _gettextCatalog_;
            controller = $controller;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController(contact = {}, address = {}) {
        $ctrl = controller('addressModalController as $ctrl', {
            $scope: scope,
            contact: contact,
            address: address
        });
    }
    describe('constructor', () => {
        beforeEach(() => {
            spyOn(NgMap, 'getMap').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'refreshMap').and.callFake(() => {});
        });
        it('shouldn\'t be editable with a remote_id', () => {
            loadController({}, { remote_id: 123 });
            expect($ctrl.isEditable).toBeFalsy();
        });
        it('should be editable with source MPDX', () => {
            loadController({}, { source: 'MPDX' });
            expect($ctrl.isEditable).toBeTruthy();
        });
        it('should be editable with source manual', () => {
            loadController({}, { source: 'manual' });
            expect($ctrl.isEditable).toBeTruthy();
        });
        it('should be editable with source TntImport', () => {
            loadController({}, { source: 'TntImport' });
            expect($ctrl.isEditable).toBeTruthy();
        });
    });
});