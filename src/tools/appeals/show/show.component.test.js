import component from './show.component';

describe('tools.appeals.show.component', () => {
    let $ctrl, scope, serverConstants, api, alerts, donations, mailchimp, modal;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _api_, _serverConstants_, _alerts_, _donations_, _mailchimp_, _modal_
        ) => {
            scope = $rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            donations = _donations_;
            mailchimp = _mailchimp_;
            modal = _modal_;
            serverConstants = _serverConstants_;
            $ctrl = $componentController('appealsShow', { $scope: scope }, {});
        });
        serverConstants.data = {
            status_hashes: [
                { id: 'a' },
                { id: 'b' }
            ]
        };
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn($ctrl, 'gettext').and.callFake((data) => data);
    });
    describe('changeGoal', () => {
        beforeEach(() => {
            spyOn($ctrl, 'save').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'changePercentage').and.callFake(() => {});
        });
        it('should call save', () => {
            $ctrl.changeGoal();
            expect($ctrl.save).toHaveBeenCalledWith();
        });
        it('should recalculate goal', (done) => {
            $ctrl.changeGoal().then(() => {
                expect($ctrl.changePercentage).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('changePercentage', () => {
        it('should recalculate percentageRaised', () => {
            $ctrl.donationsSum = 2000;
            $ctrl.appeal = { amount: 5000 };
            $ctrl.changePercentage();
            expect($ctrl.percentageRaised).toEqual(40);
        });
    });
    describe('save', () => {
        const appeal = { id: 3, name: 'a' };
        beforeEach(() => {
            $ctrl.dataInitialState = { id: 3 };
            $ctrl.appeal = appeal;
        });
        it('should call the api', () => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect(api.put).toHaveBeenCalledWith(`appeals/${appeal.id}`, appeal);
        });
        it('should alert success', (done) => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Appeal saved successfully');
                expect($ctrl.gettext).toHaveBeenCalledWith('Appeal saved successfully');
                done();
            });
        });
        it('should alert failure', (done) => {
            spyOn(api, 'put').and.callFake(() => Promise.reject());
            $ctrl.save().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Unable to save appeal', 'danger');
                expect($ctrl.gettext).toHaveBeenCalledWith('Unable to save appeal');
                done();
            });
        });
    });
    describe('contactSearch', () => {
        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.contactSearch('a');
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts',
                data: {
                    filter: {
                        account_list_id: api.account_list_id,
                        wildcard_search: 'a'
                    },
                    fields: {
                        contacts: 'name'
                    },
                    per_page: 6,
                    sort: 'name'
                },
                overrideGetAsPost: true
            });
        });
    });
    describe('onContactSelected', () => {
        beforeEach(() => {
            $ctrl.appeal = { id: 123 };
        });
        it('should add the contact to the appeal', () => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.onContactSelected({ id: 1 });
            expect(api.post).toHaveBeenCalledWith('appeals/123/contacts/1');
        });
        it('should alert success', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.onContactSelected({ id: 1 }).then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Contact successfully added to appeal');
                expect($ctrl.gettext).toHaveBeenCalledWith('Contact successfully added to appeal');
                done();
            });
        });
        it('should alert failure', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.reject());
            $ctrl.onContactSelected({ id: 1 }).catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Unable to add contact to appeal', 'danger');
                expect($ctrl.gettext).toHaveBeenCalledWith('Unable to add contact to appeal');
                done();
            });
        });
    });
    describe('selectAllGiven', () => {
        it('should add contact ids from donations', () => {
            $ctrl.appeal = {
                donations: [
                    { contact: { id: 1 } },
                    { contact: { id: 2 } }
                ]
            };
            $ctrl.selectAllGiven();
            expect($ctrl.selectedContactIds).toEqual([1, 2]);
        });
    });
    describe('deselectAllGiven', () => {
        it('should remove contact ids', () => {
            $ctrl.selectedContactIds = [1, 2, 3];
            $ctrl.appeal = {
                donations: [
                    { contact: { id: 1 } },
                    { contact: { id: 2 } }
                ]
            };
            $ctrl.deselectAllGiven();
            expect($ctrl.selectedContactIds).toEqual([3]);
        });
    });
    describe('selectAllNotGiven', () => {
        it('should add contact ids from donations', () => {
            $ctrl.selectedContactIds = [];
            $ctrl.contactsNotGiven = [
                { id: 1 },
                { id: 2 }
            ];
            $ctrl.selectAllNotGiven();
            expect($ctrl.selectedContactIds).toEqual([1, 2]);
        });
    });
    describe('deselectAllNotGiven', () => {
        it('should remove contact ids', () => {
            $ctrl.selectedContactIds = [1, 2, 3];
            $ctrl.contactsNotGiven = [
                { id: 1 },
                { id: 2 }
            ];
            $ctrl.deselectAllNotGiven();
            expect($ctrl.selectedContactIds).toEqual([3]);
        });
    });
    describe('selectContact', () => {
        it('select/deselect the contact', () => {
            $ctrl.selectedContactIds = [1, 2, 3];
            $ctrl.selectContact(1);
            expect($ctrl.selectedContactIds).toEqual([2, 3]);
            $ctrl.selectContact(1);
            expect($ctrl.selectedContactIds).toEqual([2, 3, 1]);
        });
    });
    describe('getCurrencyFromCode', () => {
        it('should retrieve a currency object', () => {
            serverConstants.data.pledge_currencies = [{ code: 'USD', symbol: '$' }];
            expect($ctrl.getCurrencyFromCode('USD')).toEqual({ code: 'USD', symbol: '$' });
        });
    });
    describe('addDonation', () => {
        it('open donation modal with the appeal pre-filled', () => {
            spyOn(donations, 'openDonationModal').and.callFake(() => {});
            $ctrl.appeal = { id: 1, name: 'a' };
            $ctrl.addDonation();
            expect(donations.openDonationModal).toHaveBeenCalledWith({ appeal: $ctrl.appeal });
        });
    });
    describe('editDonation', () => {
        it('open donation modal with the appeal pre-filled', () => {
            spyOn(donations, 'openDonationModal').and.callFake(() => {});
            $ctrl.appeal = { id: 1, name: 'a' };
            $ctrl.editDonation({ id: 123 });
            expect(donations.openDonationModal).toHaveBeenCalledWith({ id: 123, appeal: $ctrl.appeal });
        });
    });

    describe('removeDonation', () => {
        it('should open confirm modal', () => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            $ctrl.appeal = { id: 1, name: 'a' };
            $ctrl.removeDonation({ id: 123 });
            expect($ctrl.gettext).toHaveBeenCalledWith('Are you sure you wish to remove this donation?');
            expect(modal.confirm).toHaveBeenCalledWith('Are you sure you wish to remove this donation?');
        });
        it('should delete donation', done => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(donations, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.appeal = { id: 1, name: 'a' };
            $ctrl.removeDonation({ id: 123 }).then(() => {
                expect(donations.delete).toHaveBeenCalledWith({ id: 123 });
                done();
            });
        });
    });
    describe('exportToCSV', () => {
        it('should build a csv export table', () => {
            spyOn($ctrl, 'getSelectedDonationContacts').and.callFake(() => [[{ contact: { id: 1, name: 'a' } }]]);
            spyOn($ctrl, 'getSelectedContactsNotGiven').and.callFake(() => [[{ id: 2, name: 'a' }]]);
            $ctrl.selectedContactIds = [1, 2];
            expect($ctrl.exportToCSV()).toEqual([['Contact', 'Commitment', 'Donations'], [{ contact: { id: 1, name: 'a' } }], [{ id: 2, name: 'a' }]]);
        });
    });
    describe('getSelectedDonationContacts', () => {
        it('should get donation contacts', () => {
            $ctrl.selectedContactIds = [1, 2];
            $ctrl.appeal = { donations: [{ contact: { id: 1, name: 'a' } }, { contact: { id: 3, name: 'b' } }] };
            spyOn($ctrl, 'mutateDonation').and.callFake((data) => data);
            expect($ctrl.getSelectedDonationContacts()).toEqual([{ contact: { id: 1, name: 'a' } }]);
        });
    });
    describe('getSelectedContactsNotGiven', () => {
        it('should get contacts', () => {
            $ctrl.selectedContactIds = [1, 2];
            $ctrl.contactsNotGiven = [{ id: 1, name: 'a' }, { id: 3 }];
            spyOn($ctrl, 'mutateContact').and.callFake((data) => data);
            expect($ctrl.getSelectedContactsNotGiven()).toEqual([{ id: 1, name: 'a' }]);
        });
    });
    describe('mutateContact', () => {
        it('should build a contact array', () => {
            spyOn(serverConstants, 'getPledgeFrequency').and.callFake(() => { return { value: 'Monthly' }; });
            const contact = { name: 'a b', pledge_amount: 25.25, pledge_frequency: 1, currency: { symbol: '$' } };
            expect($ctrl.mutateContact(contact)).toEqual([['a b', '$25.25 Monthly']]);
        });
    });
    describe('mutateDonation', () => {
        it('should build a donation array', () => {
            const donation = { contact: { name: 'a b', pledge_amount: 25.25 }, amount: 12.5, currency: 'NZD', donation_date: '2004' };
            expect($ctrl.mutateDonation(donation)).toEqual([['a b', 25.25, '12.5 NZD 2004']]);
        });
    });
    describe('exportMailchimp', () => {
        beforeEach(() => {
            $ctrl.selectedContactIds = [1, 2];
            $ctrl.mailchimpListId = 234;
        });
        it('should export if it can', () => {
            mailchimp.data = { primary_list_id: 7 };
            spyOn($ctrl, 'doExportToMailChimp').and.callFake(() => {});
            spyOn($ctrl, 'cantExportToMailChimp').and.callFake(() => false);
            $ctrl.exportMailchimp();
            expect($ctrl.doExportToMailChimp).toHaveBeenCalledWith();
        });
        it('shouldn\'t export if it can\'t', () => {
            mailchimp.data = { primary_list_id: 7 };
            spyOn($ctrl, 'doExportToMailChimp').and.callFake(() => {});
            expect($ctrl.doExportToMailChimp).not.toHaveBeenCalled();
        });
        it('should set and call an alert if it is passed', () => {
            mailchimp.data = { primary_list_id: 7 };
            spyOn($ctrl, 'doExportToMailChimp').and.callFake(() => {});
            spyOn($ctrl, 'cantExportToMailChimp').and.callFake(() => 'ab');
            expect($ctrl.exportMailchimp()).toEqual('ab');
            expect(alerts.addAlert).toHaveBeenCalledWith('ab', 'danger');
            expect($ctrl.gettext).toHaveBeenCalledWith('ab');
        });
    });
    describe('cantExportToMailChimp', () => {
        it('should be true', () => {
            spyOn($ctrl, 'isMailChimpListUndefined').and.callFake(() => null);
            spyOn($ctrl, 'isSelectedPrimary').and.callFake(() => 'a');
            expect($ctrl.cantExportToMailChimp()).toBeTruthy();
        });
        it('should be true again', () => {
            spyOn($ctrl, 'isMailChimpListUndefined').and.callFake(() => 'ab');
            spyOn($ctrl, 'isSelectedPrimary').and.callFake(() => false);
            expect($ctrl.cantExportToMailChimp()).toBeTruthy();
        });
        it('should be message', () => {
            spyOn($ctrl, 'isMailChimpListUndefined').and.callFake(() => 'as');
            spyOn($ctrl, 'isSelectedPrimary').and.callFake(() => 'ab');
            expect($ctrl.cantExportToMailChimp()).toEqual('as');
        });
    });
    describe('isMailChimpListUndefined', () => {
        it('should return message if no primary list selected', () => {
            mailchimp.data = {};
            expect($ctrl.isMailChimpListUndefined()).toEqual('No primary Mailchimp list defined. Please select a list in preferences.');
        });
        it('should return null if list is selected', () => {
            mailchimp.data = { primary_list_id: 7 };
            expect($ctrl.isMailChimpListUndefined()).toEqual(null);
        });
    });
    describe('isSelectedPrimary', () => {
        beforeEach(() => {
            mailchimp.data = { primary_list_id: 7 };
        });
        it('should return message if no primary list selected', () => {
            $ctrl.mailchimpListId = 7;
            expect($ctrl.isSelectedPrimary()).toEqual('Please select a list other than your primary Mailchimp list.');
        });
        it('should return null if list is selected', () => {
            expect($ctrl.isSelectedPrimary()).toEqual(false);
        });
    });
    describe('doExportToMailChimp', () => {
        const appeal = { id: 3 };
        beforeEach(() => {
            $ctrl.appeal = appeal;
            $ctrl.selectedContactIds = [1, 2];
            $ctrl.mailchimpListId = 234;
        });
        it('should call the api', () => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.doExportToMailChimp();
            expect(api.post).toHaveBeenCalledWith({
                url: 'contacts/export_to_mail_chimp?mail_chimp_list_id=234',
                type: 'export_to_mail_chimps',
                data: {
                    filter: {
                        contact_ids: '1,2'
                    }
                },
                doSerialization: false
            });
        });
        it('should alert success', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.doExportToMailChimp().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Contact(s) successfully exported to Mailchimp');
                expect($ctrl.gettext).toHaveBeenCalledWith('Contact(s) successfully exported to Mailchimp');
                done();
            });
        });
        it('should alert failure', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.reject());
            $ctrl.doExportToMailChimp().catch(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Unable to add export contact(s) to Mailchimp', 'danger');
                expect($ctrl.gettext).toHaveBeenCalledWith('Unable to add export contact(s) to Mailchimp');
                done();
            });
        });
    });
});
