import component from './addresses.component';

describe('contacts.show.addresses.component', () => {
    let $ctrl, scope, modal, contacts, rootScope, gettextCatalog, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _modal_, _gettextCatalog_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            contacts = _contacts_;
            modal = _modal_;
            q = $q;
            $ctrl = $componentController('contactAddresses', { $scope: scope }, {});
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    describe('onAddressPrimary', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
            contacts.current = {
                id: 123,
                addresses: [
                    { id: 321, primary_mailing_address: false },
                    { id: 432, primary_mailing_address: true }
                ]
            };
        });

        it('should confirm with a translated message', () => {
            $ctrl.onAddressPrimary();
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
        });

        it('should save', (done) => {
            spyOn(contacts, 'save').and.callFake(() => q.resolve());
            const successMessage = 'Changes saved successfully.';
            const errorMessage = 'Unable to save changes.';
            $ctrl.onAddressPrimary(321).then(() => {
                expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                expect(contacts.save).toHaveBeenCalledWith({
                    id: contacts.current.id,
                    addresses: [
                        { id: 321, primary_mailing_address: true },
                        { id: 432, primary_mailing_address: false }
                    ]
                }, successMessage, errorMessage);
                done();
            });
            rootScope.$digest();
        });
    });
});
