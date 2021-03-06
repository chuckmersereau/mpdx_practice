import component from './details.component';

describe('contacts.show.details.component', () => {
    let $ctrl, scope, api, serverConstants, gettextCatalog, users, rootScope, contacts, q, modal, state;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _serverConstants_, _gettextCatalog_, _api_, _users_, _contacts_, $q,
            _modal_, $state
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            api = _api_;
            contacts = _contacts_;
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            users = _users_;
            q = $q;
            modal = _modal_;
            state = $state;
            serverConstants.data = { locales: {} };
            api.account_list_id = 1234;
            $ctrl = $componentController('contactDetails', { $scope: scope }, { donorAccounts: [], contact: {}, onSave: () => q.resolve() });
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
                ],
                pledge_received: [
                    { key: true, value: 'Yes' },
                    { key: false, value: 'No' }
                ]
            });
            expect(gettextCatalog.getString.calls.count()).toEqual(2);
        });

        it('should get org accounts', () => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
            $ctrl.$onInit();
            expect(users.listOrganizationAccounts).toHaveBeenCalledWith();
        });

        it('should refresh org accounts on account swap', () => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
        });
    });

    describe('$onChanges', () => {
        beforeEach(() => {
            spyOn($ctrl, 'getName').and.callFake(() => q.resolve({ name: 'a' }));
        });

        it('should get the first referrer', (done) => {
            $ctrl.contact.contacts_that_referred_me = [{ id: 1 }];
            $ctrl.referrer = null;
            $ctrl.$onChanges().then(() => {
                expect($ctrl.referrerName).toEqual('a');
                done();
            });
            rootScope.$digest();
            expect($ctrl.referrer).toEqual(1);
            expect($ctrl.getName).toHaveBeenCalledWith($ctrl.referrer);
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
    });

    describe('getName', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
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
            spyOn(contacts, 'saveCurrent').and.callFake(() => q.resolve());
        });

        it('should set the referrer to _destroy', () => {
            $ctrl.removeReferrer();
            expect($ctrl.contact.contact_referrals_to_me[0]._destroy).toEqual(1);
        });

        it('should call onSave', () => {
            $ctrl.removeReferrer();
            expect(contacts.saveCurrent).toHaveBeenCalledWith();
        });

        it('should reset the component referrer view data', (done) => {
            $ctrl.referrer = 1;
            $ctrl.referrerName = 'a';
            $ctrl.removeReferrer().then(() => {
                expect($ctrl.referrer).toEqual(null);
                expect($ctrl.referrerName).toEqual(null);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('removeNextAsk', () => {
        beforeEach(() => {
            contacts.current = { next_ask: '2000-8-10' };
            spyOn(contacts, 'saveCurrent').and.callFake(() => {});
        });

        it('should nullify next ask', () => {
            $ctrl.removeNextAsk();
            expect(contacts.current.next_ask).toEqual(null);
        });

        it('should save', () => {
            $ctrl.removeNextAsk();
            expect(contacts.saveCurrent).toHaveBeenCalledWith();
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            spyOn($ctrl, 'openDeleteModal').and.callFake(() => q.resolve());
            spyOn($ctrl, 'cantDeleteModal').and.callFake(() => q.resolve());
        });

        it('should call openDeleteModal', () => {
            $ctrl.contact.lifetime_donations = '0';
            $ctrl.remove();
            expect($ctrl.openDeleteModal).toHaveBeenCalledWith();
        });

        it('should call cantDeleteModal', () => {
            $ctrl.contact.lifetime_donations = '1';
            $ctrl.remove();
            expect($ctrl.cantDeleteModal).toHaveBeenCalledWith();
        });
    });

    describe('openDeleteModal', () => {
        beforeEach(() => {
            contacts.current = {
                id: 'contact_id',
                name: 'joe'
            };
            spyOn(modal, 'open').and.callFake(() => q.resolve());
        });

        it('should open a modal', () => {
            $ctrl.openDeleteModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./removeContact/modal.html'),
                controller: 'removeContactModalController'
            });
        });
    });

    describe('cantDeleteModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => q.resolve());
        });

        it('should open a modal', () => {
            $ctrl.cantDeleteModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./removeContact/hide.html'),
                controller: 'removeContactModalController'
            });
        });
    });
});
