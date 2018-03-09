import component from './notes.component';

describe('contacts.show.details.component', () => {
    let $ctrl, scope, gettextCatalog, contacts;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _gettextCatalog_) => {
            scope = $rootScope.$new();
            contacts = _contacts_;
            gettextCatalog = _gettextCatalog_;
            $ctrl = $componentController('contactNotes', { $scope: scope }, {});
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    describe('save', () => {
        const contact = { id: 123, notes: 'a' };
        beforeEach(() => {
            contacts.current = contact;
        });
        it('should save', (done) => {
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
            const successMessage = 'Changes saved successfully.';
            const errorMessage = 'Unable to save changes.';
            $ctrl.save().then(() => {
                expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                expect(contacts.save).toHaveBeenCalledWith(contact, successMessage, errorMessage);
                done();
            });
        });
    });
});
