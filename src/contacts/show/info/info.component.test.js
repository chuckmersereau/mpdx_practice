import component from './info.component';

describe('contacts.show.details.component', () => {
    let $ctrl, scope, serverConstants, state, gettextCatalog, contacts;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _serverConstants_, _gettextCatalog_, _contacts_) => {
            scope = $rootScope.$new();
            state = $state;
            gettextCatalog = _gettextCatalog_;
            contacts = _contacts_;
            serverConstants = _serverConstants_;
            serverConstants.data = { locales: {} };
            $ctrl = $componentController('contactInfo', { $scope: scope }, { contact: {}, onSave: () => Promise.resolve() });
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    describe('$onInit', () => {
        it('should setup translation object', () => {
            $ctrl.$onInit();
            expect($ctrl.translations).toEqual({
                pledge_received: [
                    { key: true, value: 'Yes' },
                    { key: false, value: 'No' }
                ]
            });
            expect(gettextCatalog.getString.calls.count()).toEqual(2);
        });
    });
    describe('hideContact', () => {
        beforeEach(() => {
            spyOn(contacts, 'hideContact').and.callFake(() => Promise.resolve());
            contacts.current = {
                id: 'contact_id'
            };
        });
        it('should call contacts.hideContact', () => {
            $ctrl.hideContact();
            expect(contacts.hideContact).toHaveBeenCalledWith({ id: 'contact_id' });
        });

        it('should return promise', () => {
            expect($ctrl.hideContact()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go').and.returnValue();
                $ctrl.hideContact().then(() => {
                    expect(state.go).toHaveBeenCalledWith('contacts');
                    done();
                });
            });
        });
    });
});
