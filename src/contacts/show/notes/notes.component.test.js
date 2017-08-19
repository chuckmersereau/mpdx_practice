import component from './notes.component';

describe('contacts.show.details.component', () => {
    let $ctrl, scope, gettextCatalog, alerts, contacts;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _gettextCatalog_, _alerts_) => {
            scope = $rootScope.$new();
            alerts = _alerts_;
            contacts = _contacts_;
            gettextCatalog = _gettextCatalog_;
            $ctrl = $componentController('contactNotes', { $scope: scope }, {});
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
    });
    describe('save', () => {
        const contact = { id: 123, notes: 'a' };
        beforeEach(() => {
            contacts.current = contact;
        });
        it('should save', (done) => {
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(contacts.save).toHaveBeenCalledWith(contact);
                done();
            });
        });
        it('should alert if saved', (done) => {
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should alert if rejected', (done) => {
            spyOn(contacts, 'save').and.callFake(() => Promise.reject(Error('')));
            $ctrl.save().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
});
