import component from './details.component';

describe('contacts.show.details.component', () => {
    let $ctrl, scope, api, serverConstants, gettextCatalog, modal, contacts, users, rootScope;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _contacts_, _serverConstants_, _gettextCatalog_, _api_, _modal_, _users_
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            contacts = _contacts_;
            modal = _modal_;
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            users = _users_;
            serverConstants.data = { locales: {} };
            api.account_list_id = 1234;
            $ctrl = $componentController('contactDetails', { $scope: scope }, { donorAccounts: [], contact: {}, onSave: () => Promise.resolve() });
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    describe('constructor', () => {
        it('should define view only dependencies', () => {
            expect($ctrl.contactsTags).toBeDefined();
        });
    });
    describe('$onInit', () => {
        it('should setup translation object', () => {
            $ctrl.$onInit();
            expect($ctrl.translations).toEqual({
                no_appeals: [
                    { key: false, value: 'Yes' },
                    { key: true, value: 'No' }
                ],
                no_gift_aid: [
                    { key: false, value: 'Yes' },
                    { key: true, value: 'No' }
                ],
                magazine: [
                    { key: true, value: 'Yes' },
                    { key: false, value: 'No' }
                ]
            });
            expect(gettextCatalog.getString.calls.count()).toEqual(2);
        });
        it('should get org accounts', () => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
            $ctrl.$onInit();
            expect(users.listOrganizationAccounts).toHaveBeenCalledWith();
        });
        it('should refresh org accounts on account swap', () => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
        });
    });
    describe('$onChanges', () => {
        beforeEach(() => {
            spyOn($ctrl, 'getName').and.callFake(() => Promise.resolve({ name: 'a' }));
        });
        it('should get the first referrer', (done) => {
            $ctrl.contact.contacts_that_referred_me = [{ id: 1 }];
            $ctrl.referrer = null;
            $ctrl.$onChanges().then(() => {
                expect($ctrl.referrerName).toEqual('a');
                done();
            });
            expect($ctrl.referrer).toEqual(1);
            expect($ctrl.getName).toHaveBeenCalledWith($ctrl.referrer);
        });
        it('should get the rounded last donation amount', () => {
            $ctrl.contact.last_donation = { amount: 1.23 };
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
            $ctrl.contact.last_donation = { payment_method: 'EFT' };
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
            expect(api.get).toHaveBeenCalledWith('contacts/1', {
                fields: { contacts: 'name' }
            });
        });
    });
    describe('save - referral changed', () => {
        beforeEach(() => {
            $ctrl.contact.contacts_that_referred_me = [{ id: 1 }];
            $ctrl.contact.contact_referrals_to_me = [{ id: 1 }];
            $ctrl.referrer = 2;
        });
    });
    describe('onAddressPrimary', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            contacts.current = { id: 123 };
            $ctrl.contact = {
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
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
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
                expect($ctrl.contact.addresses).toEqual([
                    { id: 321, primary_mailing_address: true },
                    { id: 432, primary_mailing_address: false }
                ]);
                done();
            });
        });
    });
    describe('showGiftAid', () => {
        describe('organizations have a gift_aid_percentage > 0', () => {
            beforeEach(() => {
                users.organizationAccounts = [
                    {
                        organization: {
                            gift_aid_percentage: 10
                        }
                    }, {
                        organization: {
                            gift_aid_percentage: null
                        }
                    }, {
                    }
                ];
            });
            it('should return true', () => {
                expect($ctrl.showGiftAid()).toEqual(true);
            });
        });
        describe('organizations have a gift_aid_percentage === 0', () => {
            beforeEach(() => {
                users.organizationAccounts = [
                    {
                        organization: {
                            gift_aid_percentage: 0
                        }
                    }, {
                        organization: {
                            gift_aid_percentage: null
                        }
                    }, {
                    }
                ];
            });
            it('should return false', () => {
                expect($ctrl.showGiftAid()).toEqual(false);
            });
        });
    });
    describe('removeReferrer', () => {
        beforeEach(() => {
            $ctrl.contact.contact_referrals_to_me = [{ id: 1 }];
            spyOn($ctrl, 'onSave').and.callFake(() => Promise.resolve());
        });
        it('should set the referrer to _destroy', () => {
            $ctrl.removeReferrer();
            expect($ctrl.contact.contact_referrals_to_me[0]._destroy).toEqual(1);
        });
        it('should call onSave', () => {
            $ctrl.removeReferrer();
            expect($ctrl.onSave).toHaveBeenCalledWith();
        });
        it('should reset the component referrer view data', (done) => {
            $ctrl.referrer = 1;
            $ctrl.referrerName = 'a';
            $ctrl.removeReferrer().then(() => {
                expect($ctrl.referrer).toEqual(null);
                expect($ctrl.referrerName).toEqual(null);
                done();
            });
        });
    });
    describe('removeNextAsk', () => {
        beforeEach(() => {
            contacts.current = { next_ask: '2000-8-10' };
            spyOn($ctrl, 'onSave').and.callFake(() => {});
        });
        it('should nullify next ask', () => {
            $ctrl.removeNextAsk();
            expect(contacts.current.next_ask).toEqual(null);
        });
        it('should save', () => {
            $ctrl.removeNextAsk();
            expect($ctrl.onSave).toHaveBeenCalledWith();
        });
    });
});
