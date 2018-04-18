import component from './show.component';

describe('tools.appeals.show.component', () => {
    let $ctrl, scope, serverConstants, api, alerts, mailchimp, modal, state, q, exportContacts, appealsShow, appeals;
    beforeEach(() => {
        angular.mock.module(component);
        inject((
            $componentController, $rootScope, _api_, _serverConstants_, _alerts_, _donations_, _mailchimp_, _modal_,
            $state, $q, _exportContacts_, _appealsShow_, _appeals_
        ) => {
            scope = $rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            api.account_list_id = 123;
            appealsShow = _appealsShow_;
            mailchimp = _mailchimp_;
            modal = _modal_;
            q = $q;
            exportContacts = _exportContacts_;
            serverConstants = _serverConstants_;
            appeals = _appeals_;
            state = $state;
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
    describe('$onInit', () => {
        const data = {
            id: 1,
            amount: '100',
            total_currency: 'USD',
            donations: []
        };
        const contactsData = {
            contacts: [
                { id: 1 },
                { id: 2 }
            ]
        };
        const currency = { code: 'USD', symbol: '$' };
        beforeEach(() => {
            $ctrl.data = data;
            $ctrl.contactsData = contactsData;
            spyOn(state, 'go').and.callFake(() => {});
            spyOn($ctrl, 'getCurrencyFromCode').and.callFake(() => currency);
            spyOn($ctrl, 'getContactsNotGiven').and.callFake(() => ['b']);
            spyOn($ctrl, 'getPledgesNotReceived').and.callFake(() => Promise.resolve(['c']));
            spyOn($ctrl, 'getPledgesNotProcessed').and.callFake(() => Promise.resolve(['d']));
            spyOn($ctrl, 'getPledgesProcessed').and.callFake(() => Promise.resolve(['e']));
            spyOn($ctrl, 'getExcludedContacts').and.callFake(() => Promise.resolve(['f ']));
            spyOn($ctrl, 'refreshLists').and.callFake(() => Promise.resolve());
        });
        it('should change state on account list change', () => {
            $ctrl.$onInit();
            scope.$emit('accountListUpdated');
            scope.$digest();
            expect(state.go).toHaveBeenCalledWith('tools.appeals');
            expect($ctrl.disableAccountListEvent).toBeDefined();
            $ctrl.$onDestroy();
        });
        it('should refresh on pledgeAdded', () => {
            $ctrl.$onInit();
            scope.$emit('pledgeAdded', { status: 'a' });
            scope.$digest();
            expect($ctrl.refreshLists).toHaveBeenCalledWith('a');
            expect($ctrl.watcher).toBeDefined();
        });
        it('should set the initial data state copy for patch', () => {
            $ctrl.$onInit();
            expect($ctrl.dataInitialState).toEqual(data);
            expect($ctrl.dataInitialState === data).toBeFalsy();
            $ctrl.$onDestroy();
        });
        it('should get currency from server constants', () => {
            $ctrl.$onInit();
            expect($ctrl.currency).toEqual(currency);
            expect($ctrl.getCurrencyFromCode).toHaveBeenCalledWith(data.total_currency);
            $ctrl.$onDestroy();
        });
        it('should get donations sum', (done) => {
            spyOn(q, 'all').and.callFake(() => Promise.resolve());
            $ctrl.pledgesNotReceived = [{ amount: 10 }];
            $ctrl.pledgesNotProcessed = [{ amount: 10 }];
            $ctrl.pledgesProcessed = [{ amount: 10 }];
            $ctrl.$onInit().then(() => {
                expect($ctrl.donationsSum).toEqual('30.00');
                done();
            });
            $ctrl.$onDestroy();
        });
        it('should get percentage raised', (done) => {
            spyOn(q, 'all').and.callFake(() => Promise.resolve());
            $ctrl.pledgesNotReceived = [{ amount: 10 }];
            $ctrl.pledgesNotProcessed = [{ amount: 10 }];
            $ctrl.pledgesProcessed = [{ amount: 10 }];
            $ctrl.$onInit().then(() => {
                expect($ctrl.percentageRaised).toEqual(30);
                done();
            });
            $ctrl.$onDestroy();
        });
        it('should append to the appeal', () => {
            $ctrl.$onInit();
            expect($ctrl.appeal.amount).toEqual('100.00');
            expect($ctrl.appeal.donations).toEqual([]);
            $ctrl.$onDestroy();
        });
        it('should get contacts', () => {
            $ctrl.$onInit();
            expect($ctrl.refreshLists).toHaveBeenCalledWith();
            $ctrl.$onDestroy();
        });
        it('should set exclusion reasons', () => {
            $ctrl.$onInit();
            expect($ctrl.reasons).toEqual({
                gave_more_than_pledged_range: 'May have given a special gift in the last 3 months',
                started_giving_range: 'May have joined my team in the last 3 months',
                pledge_amount_increased_range: 'May have increased their giving in the last 3 months',
                stopped_giving_range: 'May have stopped giving for the last 2 months',
                no_appeals: '"Send Appeals?" set to No'
            });
            $ctrl.$onDestroy();
        });
    });
    describe('$onDestroy', () => {
        it('should disable event', () => {
            $ctrl.disableAccountListEvent = () => {};
            $ctrl.watcher = () => {};
            spyOn(state, 'go').and.callFake(() => {});
            spyOn($ctrl, 'disableAccountListEvent').and.callFake(() => {});
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'refreshLists').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.disableAccountListEvent).toHaveBeenCalled();
            expect($ctrl.watcher).toHaveBeenCalled();
            scope.$emit('accountListUpdated');
            scope.$emit('pledgeAdded');
            scope.$digest();
            expect(state.go).not.toHaveBeenCalled();
            expect($ctrl.refreshLists).not.toHaveBeenCalled();
        });
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
            const successMessage = 'Appeal saved successfully';
            const errorMessage = 'Unable to save appeal';
            $ctrl.save();
            expect(api.put).toHaveBeenCalledWith(`appeals/${appeal.id}`, appeal, successMessage, errorMessage);

            expect($ctrl.gettext).toHaveBeenCalledWith(successMessage);
            expect($ctrl.gettext).toHaveBeenCalledWith(errorMessage);
        });
    });
    describe('contactSearch', () => {
        it('should query the api', () => {
            $ctrl.appeal = { id: 1 };
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.contactSearch('a');
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts',
                data: {
                    filter: {
                        appeal: 1,
                        reverse_appeal: true,
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
            const successMessage = 'Contact successfully added to appeal';
            const errorMessage = 'Unable to add contact to appeal';
            $ctrl.onContactSelected({ id: 1 });
            expect(api.post).toHaveBeenCalledWith({
                url: 'appeals/123/appeal_contacts',
                data: {
                    id: jasmine.any(String),
                    appeal: {
                        id: 123
                    },
                    contact: {
                        id: 1
                    }
                },
                type: 'appeal_contacts',
                successMessage: successMessage,
                errorMessage: errorMessage
            });
            expect($ctrl.gettext).toHaveBeenCalledWith(successMessage);
            expect($ctrl.gettext).toHaveBeenCalledWith(errorMessage);
        });
    });
    describe('removeContact', () => {
        const contact = { id: 1 };
        beforeEach(() => {
            $ctrl.appeal = { id: 123 };
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(appeals, 'removeContact').and.callFake(() => Promise.resolve());
        });
        it('should open confirm modal', () => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.appeal = { id: 1, name: 'a' };
            $ctrl.removeContact(contact);
            expect($ctrl.gettext).toHaveBeenCalledWith('Are you sure you wish to remove this contact from the appeal?');
            expect(modal.confirm).toHaveBeenCalledWith('Are you sure you wish to remove this contact from the appeal?');
        });
        it('should delete contact', (done) => {
            $ctrl.removeContact(contact).then(() => {
                expect(appeals.removeContact).toHaveBeenCalledWith($ctrl.appeal.id, contact.id);
                done();
            });
        });
    });
    describe('addExcludedContact', () => {
        const rel = {
            id: 1,
            contact: { id: 2 }
        };
        beforeEach(() => {
            spyOn($ctrl, 'onContactSelected').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'getExcludedContacts').and.callFake(() => {});
            spyOn($ctrl, 'getContactsNotGiven').and.callFake(() => {});
        });
        it('should remove the excluded contact', () => {
            spyOn($ctrl, 'removeExcludedContact').and.callFake(() => Promise.resolve());
            $ctrl.addExcludedContact(rel);
            expect($ctrl.removeExcludedContact).toHaveBeenCalledWith(1);
        });
        it('should add the contact', (done) => {
            spyOn($ctrl, 'removeExcludedContact').and.callFake(() => Promise.resolve());
            const successMessage = 'Excluded contact successfully added to appeal';
            const errorMessage = 'Unable to add excluded contact to appeal';
            $ctrl.addExcludedContact(rel).then(() => {
                expect($ctrl.onContactSelected).toHaveBeenCalledWith(rel.contact, successMessage, errorMessage);
                expect($ctrl.gettext).toHaveBeenCalledWith(successMessage);
                expect($ctrl.gettext).toHaveBeenCalledWith(errorMessage);
                done();
            });
        });
        it('should refresh the current not-given contacts page', (done) => {
            spyOn($ctrl, 'removeExcludedContact').and.callFake(() => Promise.resolve());
            $ctrl.addExcludedContact(rel).then(() => {
                expect($ctrl.getContactsNotGiven).toHaveBeenCalledWith();
                done();
            });
        });
        it('should refresh the current excluded contacts page', (done) => {
            spyOn($ctrl, 'removeExcludedContact').and.callFake(() => Promise.resolve());
            $ctrl.addExcludedContact(rel).then(() => {
                expect($ctrl.getExcludedContacts).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('removeExcludedContact', () => {
        it('should remove excluded contacts', () => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.appeal = { id: 1 };
            $ctrl.removeExcludedContact(2);
            expect(api.delete).toHaveBeenCalledWith('appeals/1/excluded_appeal_contacts/2');
        });
    });
    describe('selectAllPledges', () => {
        beforeEach(() => {
            $ctrl.appeal = { id: 123 };
            spyOn(api, 'get').and.callFake(() => Promise.resolve([
                { contact: { id: 1 } }, { contact: { id: 2 } }, { contact: null }
            ]));
        });
        it('should query the api for all contacts', () => {
            $ctrl.selectAllPledges('a');
            expect(api.get).toHaveBeenCalledWith('account_lists/123/pledges', {
                include: 'contact',
                per_page: 10000,
                fields: {
                    pledges: 'contact',
                    contacts: ''
                },
                filter: {
                    appeal_id: 123,
                    status: 'a'
                }
            });
        });
        it('should map contact ids from donations', (done) => {
            $ctrl.selectAllPledges('a').then(() => {
                expect($ctrl.selectedContactIds).toEqual([1, 2]);
                done();
            });
        });
    });
    describe('selectAllNotGiven', () => {
        beforeEach(() => {
            $ctrl.appeal = { id: 123 };
            spyOn(api, 'get').and.callFake(() => Promise.resolve([
                { contact: { id: 1 } }, { contact: { id: 2 } }, { contact: null }
            ]));
        });
        it('should query the api for all contacts', () => {
            $ctrl.selectAllNotGiven();
            expect(api.get).toHaveBeenCalledWith('appeals/123/appeal_contacts', {
                per_page: 10000,
                include: 'contact',
                filter: {
                    pledged_to_appeal: false
                },
                fields: {
                    appeal_contacts: 'contact',
                    contact: ''
                }
            });
        });
        it('should map contact ids from donations', (done) => {
            $ctrl.selectAllNotGiven().then(() => {
                expect($ctrl.selectedContactIds).toEqual([1, 2]);
                done();
            });
        });
    });
    describe('deselectAll', () => {
        it('should remove all contact ids', () => {
            $ctrl.selectedContactIds = [1, 2, 3];
            $ctrl.deselectAll();
            expect($ctrl.selectedContactIds).toEqual([]);
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
    describe('getCurrencySymbolFromCode', () => {
        it('should retrieve a currency symbol', () => {
            serverConstants.data.pledge_currencies = [{ code: 'USD', symbol: '$' }];
            expect($ctrl.getCurrencySymbolFromCode('USD')).toEqual('$');
        });
    });
    describe('getCurrencySymbols', () => {
        it('should retrieve a currency symbol', () => {
            spyOn($ctrl, 'getCurrencySymbolFromCode').and.callFake(() => '$');
            serverConstants.data.pledge_currencies = [{ code: 'USD', symbol: '$' }];
            expect($ctrl.getCurrencySymbols([{ currency: 'USD' }])).toEqual([
                { currency: 'USD', symbol: '$', converted_symbol: '$' }
            ]);
        });
    });
    describe('removePledge', () => {
        const pledge = { id: 123 };
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'refreshLists').and.callFake(() => {});
            spyOn(appeals, 'removePledge').and.callFake(() => Promise.resolve());
        });
        it('should open confirm modal', () => {
            $ctrl.removePledge(pledge);
            expect($ctrl.gettext).toHaveBeenCalledWith('Are you sure you wish to remove this commitment?');
            expect(modal.confirm).toHaveBeenCalledWith('Are you sure you wish to remove this commitment?');
        });
        it('should delete donation', (done) => {
            $ctrl.removePledge(pledge).then(() => {
                expect(appeals.removePledge).toHaveBeenCalledWith(pledge.id);
                done();
            });
        });
        it('should call refreshLists on success', (done) => {
            $ctrl.removePledge(pledge).then(() => {
                expect($ctrl.refreshLists).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('exportToCSV', () => {
        it('should build a csv export table', () => {
            spyOn(exportContacts, 'primaryCSVLink').and.callFake(() => Promise.resolve());
            $ctrl.selectedContactIds = [1, 2];
            $ctrl.exportToCSV();
            expect(exportContacts.primaryCSVLink).toHaveBeenCalledWith({
                data: {
                    filter: {
                        account_list_id: api.account_list_id,
                        ids: '1,2',
                        status: 'active,hidden,null'
                    }
                },
                doDeSerialization: false,
                overrideGetAsPost: true
            });
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
            const successMessage = 'Contact(s) successfully exported to Mailchimp';
            const errorMessage = 'Unable to add export contact(s) to Mailchimp';
            $ctrl.doExportToMailChimp();
            expect(api.post).toHaveBeenCalledWith({
                url: 'contacts/export_to_mail_chimp?mail_chimp_list_id=234',
                type: 'export_to_mail_chimps',
                data: {
                    filter: {
                        account_list_id: api.account_list_id,
                        contact_ids: [1, 2]
                    }
                },
                doSerialization: false,
                successMessage: successMessage,
                errorMessage: errorMessage
            });
            expect($ctrl.gettext).toHaveBeenCalledWith(successMessage);
            expect($ctrl.gettext).toHaveBeenCalledWith(errorMessage);
        });
    });
    describe('getContactsNotGiven', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({ meta: 'b' }));
            spyOn($ctrl, 'fixPledgeAmount').and.callFake(() => ['a']);
            spyOn($ctrl.blockUIAsking, 'start').and.callFake(() => {});
            spyOn($ctrl.blockUIAsking, 'reset').and.callFake(() => {});
            $ctrl.appeal = { id: 1 };
        });
        it('should block the UI', () => {
            $ctrl.getContactsNotGiven();
            expect($ctrl.blockUIAsking.start).toHaveBeenCalledWith();
        });
        it('should call the api', () => {
            $ctrl.getContactsNotGiven();
            expect(api.get).toHaveBeenCalledWith('appeals/1/appeal_contacts', {
                page: 1,
                per_page: 20,
                include: 'contact',
                filter: {
                    pledged_to_appeal: false
                },
                fields: {
                    contact: 'name,pledge_amount,pledge_currency,pledge_frequency'
                },
                sort: 'contact.name'
            });
        });
        it('should handle pagination', () => {
            $ctrl.getContactsNotGiven(2);
            expect(api.get).toHaveBeenCalledWith('appeals/1/appeal_contacts', {
                page: 2,
                per_page: 20,
                include: 'contact',
                filter: {
                    pledged_to_appeal: false
                },
                fields: {
                    contact: 'name,pledge_amount,pledge_currency,pledge_frequency'
                },
                sort: 'contact.name'
            });
        });
        it('should set contactsNotGiven', (done) => {
            $ctrl.getContactsNotGiven().then(() => {
                expect($ctrl.contactsNotGiven[0]).toEqual('a');
                done();
            });
        });
        it('should set meta', (done) => {
            $ctrl.getContactsNotGiven().then(() => {
                expect($ctrl.contactsNotGiven.meta).toEqual('b');
                done();
            });
        });
        it('should unblock the UI', (done) => {
            $ctrl.getContactsNotGiven().then(() => {
                expect($ctrl.blockUIAsking.reset).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('getPledgesNotReceived', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({ meta: 'b' }));
            spyOn($ctrl, 'fixPledgeAmount').and.callFake(() => ['a']);
            spyOn($ctrl.blockUICommitted, 'start').and.callFake(() => {});
            spyOn($ctrl.blockUICommitted, 'reset').and.callFake(() => {});
            $ctrl.appeal = { id: 1 };
        });
        it('should block the UI', () => {
            $ctrl.getPledgesNotReceived();
            expect($ctrl.blockUICommitted.start).toHaveBeenCalledWith();
        });
        it('should call the api', () => {
            $ctrl.getPledgesNotReceived();
            expect(api.get).toHaveBeenCalledWith('account_lists/123/pledges', {
                include: 'contact',
                page: 1,
                per_page: 20,
                fields: {
                    contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
                },
                filter: {
                    appeal_id: 1,
                    status: 'not_received'
                },
                sort: 'contact.name'
            });
        });
        it('should handle pagination', () => {
            $ctrl.getPledgesNotReceived(2);
            expect(api.get).toHaveBeenCalledWith('account_lists/123/pledges', {
                page: 2,
                per_page: 20,
                include: 'contact',
                fields: {
                    contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
                },
                filter: {
                    appeal_id: 1,
                    status: 'not_received'
                },
                sort: 'contact.name'
            });
        });
        it('should set contactsNotGiven', (done) => {
            $ctrl.getPledgesNotReceived().then(() => {
                expect($ctrl.pledgesNotReceived[0]).toEqual('a');
                done();
            });
        });
        it('should set meta', (done) => {
            $ctrl.getPledgesNotReceived().then(() => {
                expect($ctrl.pledgesNotReceived.meta).toEqual('b');
                done();
            });
        });
        it('should unblock the UI', (done) => {
            $ctrl.getPledgesNotReceived().then(() => {
                expect($ctrl.blockUICommitted.reset).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('getPledgesNotProcessed', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({ meta: 'b' }));
            spyOn($ctrl, 'fixPledgeAmount').and.callFake(() => ['a']);
            spyOn($ctrl.blockUIReceived, 'start').and.callFake(() => {});
            spyOn($ctrl.blockUIReceived, 'reset').and.callFake(() => {});
            $ctrl.appeal = { id: 1 };
        });
        it('should block the UI', () => {
            $ctrl.getPledgesNotProcessed();
            expect($ctrl.blockUIReceived.start).toHaveBeenCalledWith();
        });
        it('should call the api', () => {
            $ctrl.getPledgesNotProcessed();
            expect(api.get).toHaveBeenCalledWith('account_lists/123/pledges', {
                include: 'contact',
                page: 1,
                per_page: 20,
                fields: {
                    contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
                },
                filter: {
                    appeal_id: 1,
                    status: 'received_not_processed'
                },
                sort: 'contact.name'
            });
        });
        it('should handle pagination', () => {
            $ctrl.getPledgesNotProcessed(2);
            expect(api.get).toHaveBeenCalledWith('account_lists/123/pledges', {
                page: 2,
                per_page: 20,
                include: 'contact',
                fields: {
                    contacts: 'name,pledge_amount,pledge_currency,pledge_frequency'
                },
                filter: {
                    appeal_id: 1,
                    status: 'received_not_processed'
                },
                sort: 'contact.name'
            });
        });
        it('should set contactsNotGiven', (done) => {
            $ctrl.getPledgesNotProcessed().then(() => {
                expect($ctrl.pledgesNotProcessed[0]).toEqual('a');
                done();
            });
        });
        it('should set meta', (done) => {
            $ctrl.getPledgesNotProcessed().then(() => {
                expect($ctrl.pledgesNotProcessed.meta).toEqual('b');
                done();
            });
        });
        it('should unblock the UI', (done) => {
            $ctrl.getPledgesNotProcessed().then(() => {
                expect($ctrl.blockUIReceived.reset).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('getPledgesProcessed', () => {
        beforeEach(() => {
            let retVal = [{ id: 1 }];
            retVal.meta = 'b';
            spyOn(api, 'get').and.callFake(() => Promise.resolve(retVal));
            spyOn($ctrl, 'fixPledgeAmount').and.callFake(() => [{ id: 1 }]);
            spyOn($ctrl.blockUIGiven, 'start').and.callFake(() => {});
            spyOn($ctrl.blockUIGiven, 'reset').and.callFake(() => {});
            $ctrl.appeal = { id: 1 };
        });
        it('should block the UI', () => {
            $ctrl.getPledgesProcessed();
            expect($ctrl.blockUIGiven.start).toHaveBeenCalledWith();
        });
        it('should call the api', () => {
            $ctrl.getPledgesProcessed();
            expect(api.get).toHaveBeenCalledWith('account_lists/123/pledges', {
                include: 'contact,donations',
                page: 1,
                per_page: 20,
                fields: {
                    contacts: 'name',
                    donations: 'appeal_amount,converted_appeal_amount,currency,converted_currency,donation_date'
                },
                filter: {
                    appeal_id: 1,
                    status: 'processed'
                },
                sort: 'contact.name'
            });
        });
        it('should handle pagination', () => {
            $ctrl.getPledgesProcessed(2);
            expect(api.get).toHaveBeenCalledWith('account_lists/123/pledges', {
                include: 'contact,donations',
                page: 2,
                per_page: 20,
                fields: {
                    contacts: 'name',
                    donations: 'appeal_amount,converted_appeal_amount,currency,converted_currency,donation_date'
                },
                filter: {
                    appeal_id: 1,
                    status: 'processed'
                },
                sort: 'contact.name'
            });
        });
        it('should set contactsNotGiven', (done) => {
            $ctrl.getPledgesProcessed().then(() => {
                expect($ctrl.pledgesProcessed[0].id).toEqual(1);
                done();
            });
        });
        it('should set meta', (done) => {
            $ctrl.getPledgesProcessed().then(() => {
                expect($ctrl.pledgesProcessed.meta).toEqual('b');
                done();
            });
        });
        it('should unblock the UI', (done) => {
            $ctrl.getPledgesProcessed().then(() => {
                expect($ctrl.blockUIGiven.reset).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('fixPledgeAmount', () => {
        it('should set pledge_amount to fixed value', () => {
            expect($ctrl.fixPledgeAmount([{ contact: { pledge_amount: 10 } }]))
                .toEqual([{ contact: { pledge_amount: '10.00' } }]);
        });
    });
    describe('addPledge', () => {
        const contact = { id: 3 };
        it('should open the add Pledge modal', () => {
            spyOn(modal, 'open').and.callFake(() => {});
            $ctrl.appeal = { id: 3 };
            $ctrl.addPledge(contact);
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./addPledge/add.html'),
                controller: 'addPledgeController',
                locals: {
                    appealId: 3,
                    contact: contact
                }
            });
        });
    });
    describe('editPledge', () => {
        it('should open the edit pledge modal', () => {
            spyOn(modal, 'open').and.callFake(() => {});
            $ctrl.appeal = { id: 3 };
            $ctrl.editPledge({ id: 2 });
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./editPledge/edit.html'),
                controller: 'editPledgeController',
                locals: {
                    appealId: 3,
                    pledge: { id: 2 }
                }
            });
        });
    });
    describe('getExcludedContacts', () => {
        let data = [{ id: 2 }];
        data.meta = { pagination: {} };
        beforeEach(() => {
            $ctrl.appeal = { id: 1 };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(data));
            spyOn($ctrl.blockUIExcluded, 'start').and.callFake(() => {});
            spyOn($ctrl.blockUIExcluded, 'reset').and.callFake(() => {});
        });
        it('should block the UI', () => {
            $ctrl.getExcludedContacts();
            expect($ctrl.blockUIExcluded.start).toHaveBeenCalledWith();
        });
        it('should call the api', () => {
            $ctrl.getExcludedContacts();
            expect(api.get).toHaveBeenCalledWith('appeals/1/excluded_appeal_contacts', {
                include: 'contact',
                fields: {
                    contact: 'name,pledge_amount,pledge_currency,pledge_frequency'
                },
                per_page: 20,
                page: 1,
                sort: 'contact.name'
            });
        });
        it('should set data', (done) => {
            $ctrl.getExcludedContacts().then(() => {
                expect($ctrl.excludedContacts).toEqual(data);
                done();
            });
        });
        it('should set meta', (done) => {
            $ctrl.getExcludedContacts().then(() => {
                expect($ctrl.excludedContacts.meta).toEqual(data.meta);
                done();
            });
        });
        it('should set page', (done) => {
            $ctrl.getExcludedContacts().then(() => {
                expect($ctrl.excludedContactsPage).toEqual(1);
                done();
            });
        });
        it('should unblock the UI', (done) => {
            $ctrl.getExcludedContacts().then(() => {
                expect($ctrl.blockUIExcluded.reset).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('reloadAppeal', () => {
        beforeEach(() => {
            $ctrl.appeal = { id: 1 };
            spyOn(appealsShow, 'getAppeal').and.callFake(() => Promise.resolve('a'));
        });
        it('should get appeal data', () => {
            $ctrl.reloadAppeal();
            expect(appealsShow.getAppeal).toHaveBeenCalledWith(1);
        });
        it('should set appeal data', (done) => {
            $ctrl.reloadAppeal().then(() => {
                expect($ctrl.appeal).toEqual('a');
                done();
            });
        });
    });
    describe('getReasons', () => {
        const data = {
            id: 1,
            amount: '100',
            total_currency: 'USD',
            donations: []
        };
        const contactsData = {
            contacts: [
                { id: 1 },
                { id: 2 }
            ]
        };
        const currency = { code: 'USD', symbol: '$' };
        beforeEach(() => {
            $ctrl.data = data;
            $ctrl.contactsData = contactsData;
            spyOn(state, 'go').and.callFake(() => {});
            spyOn($ctrl, 'getCurrencyFromCode').and.callFake(() => currency);
            spyOn($ctrl, 'getContactsNotGiven').and.callFake(() => ['b']);
            spyOn($ctrl, 'getPledgesNotReceived').and.callFake(() => Promise.resolve(['c']));
            spyOn($ctrl, 'getPledgesNotProcessed').and.callFake(() => Promise.resolve(['d']));
            spyOn($ctrl, 'getPledgesProcessed').and.callFake(() => Promise.resolve(['e']));
            spyOn($ctrl, 'getExcludedContacts').and.callFake(() => Promise.resolve(['f ']));
            spyOn($ctrl, 'refreshLists').and.callFake(() => Promise.resolve());
        });
        it('should return reasons from excluded contacts', () => {
            $ctrl.$onInit();
            expect($ctrl.getReasons({ reasons: ['gave_more_than_pledged_range'] })).toEqual(['May have given a special gift in the last 3 months']);
            $ctrl.$onDestroy();
        });
    });
    describe('refreshLists', () => {
        beforeEach(() => {
            spyOn($ctrl, 'getContactsNotGiven').and.callFake(() => ['b']);
            spyOn($ctrl, 'getPledgesNotReceived').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'getPledgesNotProcessed').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'getPledgesProcessed').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'getExcludedContacts').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'refreshAllStatuses').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'reloadAppeal').and.callFake(() => Promise.resolve());
        });
        it('should call getContactsNotGiven', () => {
            $ctrl.refreshLists();
            expect($ctrl.getContactsNotGiven).toHaveBeenCalledWith();
        });
        it('should call refreshAllStatuses', () => {
            $ctrl.refreshLists();
            expect($ctrl.refreshAllStatuses).toHaveBeenCalledWith();
            expect($ctrl.getPledgesProcessed).not.toHaveBeenCalled();
            expect($ctrl.getPledgesNotReceived).not.toHaveBeenCalled();
            expect($ctrl.getPledgesNotProcessed).not.toHaveBeenCalled();
        });
        it('should call reloadAppeal', () => {
            $ctrl.refreshLists();
            expect($ctrl.reloadAppeal).toHaveBeenCalledWith();
        });
        it('should call getPledgesProcessed', () => {
            $ctrl.refreshLists('processed');
            expect($ctrl.getPledgesProcessed).toHaveBeenCalledWith();
            expect($ctrl.getPledgesNotReceived).not.toHaveBeenCalled();
            expect($ctrl.getPledgesNotProcessed).not.toHaveBeenCalled();
            expect($ctrl.refreshAllStatuses).not.toHaveBeenCalled();
        });
        it('should call getPledgesNotProcessed', () => {
            $ctrl.refreshLists('received_not_processed');
            expect($ctrl.getPledgesNotProcessed).toHaveBeenCalledWith();
            expect($ctrl.getPledgesProcessed).not.toHaveBeenCalled();
            expect($ctrl.getPledgesNotReceived).not.toHaveBeenCalled();
            expect($ctrl.refreshAllStatuses).not.toHaveBeenCalled();
        });
        it('should call getPledgesNotReceived', () => {
            $ctrl.refreshLists('not_received');
            expect($ctrl.getPledgesNotReceived).toHaveBeenCalledWith();
            expect($ctrl.getPledgesProcessed).not.toHaveBeenCalled();
            expect($ctrl.refreshAllStatuses).not.toHaveBeenCalled();
            expect($ctrl.refreshAllStatuses).not.toHaveBeenCalled();
        });
    });
    describe('switchTab', () => {
        it('should change activeTab', () => {
            $ctrl.switchTab('a');
            expect($ctrl.activeTab).toEqual('a');
        });
        it('should deselect all contacts', () => {
            spyOn($ctrl, 'deselectAll').and.callFake(() => {});
            $ctrl.switchTab('a');
            expect($ctrl.deselectAll).toHaveBeenCalledWith();
        });
    });
    describe('deleteAppeal', () => {
        const msg = 'You are about to permanently delete this Appeal. This will remove all contacts, and delete all pledges, and progress towards this appeal. Are you sure you want to continue?';
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            spyOn(state, 'go').and.callFake(() => () => {});
        });
        it('should translate a message', () => {
            $ctrl.deleteAppeal();
            expect($ctrl.gettext).toHaveBeenCalledWith(msg);
        });
        it('should open a confirm modal', () => {
            $ctrl.deleteAppeal();
            expect(modal.confirm).toHaveBeenCalledWith(msg);
        });
        it('should call delete', (done) => {
            $ctrl.appeal = { id: 1 };
            const errorMessage = 'There was an error trying to delete the appeal.';
            $ctrl.deleteAppeal().then(() => {
                expect($ctrl.gettext).toHaveBeenCalledWith(errorMessage);
                expect(api.delete).toHaveBeenCalledWith('appeals/1', undefined, undefined, errorMessage);
                done();
            });
        });
        it('should navigate to list view ', (done) => {
            $ctrl.appeal = { id: 1 };
            $ctrl.deleteAppeal().then(() => {
                expect(state.go).toHaveBeenCalledWith('tools.appeals');
                done();
            });
        });
    });
});
