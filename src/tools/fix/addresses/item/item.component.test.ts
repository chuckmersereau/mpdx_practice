import component from './item.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.addresses.item.component', () => {
    let $ctrl, rootScope, scope, blockUI, contact, contacts, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _blockUI_, _contacts_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            blockUI = _blockUI_;
            contacts = _contacts_;
            q = $q;
            contact = { id: 'contact_id' };
            spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
            $ctrl = $componentController('fixAddressesItem', { $scope: scope }, { contact: contact, onSave: () => {} });
        });
    });

    describe('$onInit', () => {
        it('should get instance of blockUI', () => {
            $ctrl.$onInit();
            expect(blockUI.instances.get).toHaveBeenCalledWith('fix-addresses-item-contact_id');
            expect($ctrl.blockUI).toEqual(fakeBlockUI);
        });
    });

    describe('hasPrimary', () => {
        describe('has single primary', () => {
            it('should return true', () => {
                $ctrl.contact = {
                    id: 'contact_id',
                    addresses: [
                        { primary_mailing_address: true },
                        { primary_mailing_address: false },
                        { primary_mailing_address: false }
                    ]
                };
                expect($ctrl.hasPrimary()).toBeTruthy();
            });
        });

        describe('has multiple primaries', () => {
            it('should return false', () => {
                $ctrl.contact = {
                    id: 'contact_id',
                    addresses: [
                        { primary_mailing_address: true },
                        { primary_mailing_address: true },
                        { primary_mailing_address: false }
                    ]
                };
                expect($ctrl.hasPrimary()).toBeFalsy();
            });
        });

        describe('has no primaries', () => {
            it('should return false', () => {
                $ctrl.contact = {
                    id: 'contact_id',
                    addresses: [
                        { primary_mailing_address: false },
                        { primary_mailing_address: false },
                        { primary_mailing_address: false }
                    ]
                };
                expect($ctrl.hasPrimary()).toBeFalsy();
            });
        });
    });

    describe('save', () => {
        let contact;
        beforeEach(() => {
            contact = { id: 'contact_id', addresses: [{ id: 1 }, { id: 2 }] };
            spyOn($ctrl.blockUI, 'start').and.callThrough();
            spyOn($ctrl.blockUI, 'reset').and.callThrough();
            spyOn(contacts, 'save').and.callFake(() => q.resolve());
        });

        it('should have toggled blockUI', (done) => {
            $ctrl.save().then(() => {
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                expect($ctrl.blockUI.start).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });

        it('should call the contacts service', () => {
            $ctrl.contact = contact;
            $ctrl.save();
            expect(contacts.save).toHaveBeenCalledWith({
                id: 'contact_id',
                addresses: [{ valid_values: true, id: 1 }, { valid_values: true, id: 2 }]
            });
        });

        it('should call onSave', (done) => {
            spyOn($ctrl, 'onSave').and.callFake(() => {});
            $ctrl.contact = contact;
            $ctrl.save(contact).then(() => {
                expect($ctrl.onSave).toHaveBeenCalledWith({ contact: contact });
                done();
            });
            scope.$digest();
        });
    });
});
