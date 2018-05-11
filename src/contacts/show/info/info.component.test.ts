import component from './info.component';

describe('contacts.show.details.component', () => {
    let $ctrl, scope, serverConstants, state, gettextCatalog, contacts, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $state, _serverConstants_, _gettextCatalog_, _contacts_, $q) => {
            scope = $rootScope.$new();
            state = $state;
            gettextCatalog = _gettextCatalog_;
            contacts = _contacts_;
            serverConstants = _serverConstants_;
            q = $q;
            serverConstants.data = { locales: {} };
            $ctrl = $componentController('contactInfo', { $scope: scope }, { contact: {}, onSave: () => q.resolve() });
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    describe('hideContact', () => {
        beforeEach(() => {
            spyOn(contacts, 'hideContact').and.callFake(() => q.resolve());
            contacts.current = {
                id: 'contact_id'
            };
        });

        it('should call contacts.hideContact', () => {
            $ctrl.hideContact();
            expect(contacts.hideContact).toHaveBeenCalledWith({ id: 'contact_id' });
        });

        it('should return promise', () => {
            expect($ctrl.hideContact()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should call state.go', (done) => {
                spyOn(state, 'go').and.returnValue('');
                $ctrl.hideContact().then(() => {
                    expect(state.go).toHaveBeenCalledWith('contacts');
                    done();
                });
                scope.$digest();
            });
        });
    });
});
