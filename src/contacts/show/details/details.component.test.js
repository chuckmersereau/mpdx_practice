import component from './details.component';

describe('contacts.show.details.component', () => {
    let $ctrl, scope, api, serverConstants, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _tasks_, _serverConstants_, _gettextCatalog_, _api_) => {
            scope = $rootScope.$new();
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            serverConstants.data = {locales: {}};
            window.languageMappingList = [];
            api.account_list_id = 1234;
            $ctrl = $componentController('contactDetails', {$scope: scope}, {donorAccounts: [], contact: {}, onSave: () => Promise.resolve()});
        });
        spyOn(gettextCatalog, 'getString').and.callFake(data => data);
    });
    describe('$onChanges', () => {
        beforeEach(() => {
            spyOn($ctrl, 'getName').and.callFake(() => Promise.resolve({name: 'a'}));
        });
        it('should get the first referrer', (done) => {
            $ctrl.contact.contacts_that_referred_me = [{id: 1}];
            $ctrl.referrer = null;
            $ctrl.$onChanges().then(() => {
                expect($ctrl.referrerName).toEqual('a');
                done();
            });
            expect($ctrl.referrer).toEqual(1);
            expect($ctrl.getName).toHaveBeenCalledWith($ctrl.referrer);
        });
        it('should get the rounded last donation amount', () => {
            $ctrl.contact.last_donation = {amount: 1.23};
            $ctrl.$onChanges();
            expect($ctrl.last_donation).toEqual(1);
        });
        it('should set the last donation amount to translated Never if null', () => {
            $ctrl.contact.last_donation = null;
            $ctrl.$onChanges();
            expect($ctrl.last_donation).toEqual('Never');
            expect(gettextCatalog.getString).toHaveBeenCalledWith('Never');
        });
        it('should get the giving method', () => {
            $ctrl.contact.last_donation = {payment_method: 'EFT'};
            $ctrl.$onChanges();
            expect($ctrl.giving_method).toEqual('EFT');
        });
        it('should set the giving method to translated None if null', () => {
            $ctrl.contact.last_donation = null;
            $ctrl.$onChanges();
            expect($ctrl.giving_method).toEqual('None');
            expect(gettextCatalog.getString).toHaveBeenCalledWith('None');
        });
        it('should get the lifetime donations', () => {
            $ctrl.contact.lifetime_donations = 1.23;
            $ctrl.$onChanges();
            expect($ctrl.lifetime_donations).toEqual(1);
        });
        it('should set the lifetime donations to 0 if null', () => {
            $ctrl.contact.lifetime_donations = null;
            $ctrl.$onChanges();
            expect($ctrl.lifetime_donations).toEqual(0);
        });
    });
    describe('getName', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
        });
        it('should query api for a name by id', () => {
            $ctrl.getName(1);
            expect(api.get).toHaveBeenCalledWith(`contacts/1`, {
                fields: { contacts: 'name' }
            });
        });
    });
});
