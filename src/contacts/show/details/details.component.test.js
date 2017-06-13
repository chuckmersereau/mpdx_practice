import component from './details.component';

describe('contacts.show.details.component', () => {
    let $ctrl, scope, api, serverConstants, gettextCatalog, alerts, modal, contacts;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _serverConstants_, _gettextCatalog_, _api_, _alerts_, _modal_) => {
            scope = $rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            contacts = _contacts_;
            modal = _modal_;
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            serverConstants.data = {locales: {}};
            window.languageMappingList = [];
            api.account_list_id = 1234;
            $ctrl = $componentController('contactDetails', {$scope: scope}, {donorAccounts: [], contact: {}, onSave: () => Promise.resolve()});
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(alerts, 'addAlert').and.callFake(data => data);
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
    describe('save - referral changed', () => {
        beforeEach(() => {
            $ctrl.contact.contacts_that_referred_me = [{id: 1}];
            $ctrl.contact.contact_referrals_to_me = [{id: 1}];
            $ctrl.referrer = 2;
        });
        it('should alert', done => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should alert if rejected', done => {
            spyOn(api, 'put').and.callFake(() => Promise.reject(Error('')));
            $ctrl.save().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
    describe('onAddressPrimary', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            contacts.current = {id: 123};
            $ctrl.contact = {addresses: [{id: 321, primary_mailing_address: false}, {id: 432, primary_mailing_address: true}]};
        });
        it('should confirm with a translated message', () => {
            $ctrl.onAddressPrimary();
            expect(modal.confirm).toHaveBeenCalledWith(jasmine.any(String));
            expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
        });
        it('should save', done => {
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
            $ctrl.onAddressPrimary(321).then(() => {
                expect(contacts.save).toHaveBeenCalledWith({id: contacts.current.id, addresses: [{ id: 321, primary_mailing_address: true }, {id: 432, primary_mailing_address: false}]});
                expect($ctrl.contact.addresses).toEqual([{ id: 321, primary_mailing_address: true }, {id: 432, primary_mailing_address: false}]);
                done();
            });
        });
        it('should alert if referral changed', done => {
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
            $ctrl.onAddressPrimary(321).then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
        it('should alert if referral changed and rejected', done => {
            spyOn(contacts, 'save').and.callFake(() => Promise.reject(Error('')));
            $ctrl.onAddressPrimary().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String), 'danger');
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
});
