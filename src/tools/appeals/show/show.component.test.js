import component from './show.component';

describe('tools.appeals.show.component', () => {
    let $ctrl, scope, serverConstants, contacts, api, alerts, gettext, donations;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _api_, _serverConstants_, _alerts_, _gettext_, _donations_) => {
            scope = $rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            contacts = _contacts_;
            donations = _donations_;
            gettext = _gettext_;
            serverConstants = _serverConstants_;
            $ctrl = $componentController('appealsShow', {$scope: scope}, {});
        });
        serverConstants.data = {
            status_hashes: [
                {id: 'a'},
                {id: 'b'}
            ]
        };
        spyOn(alerts, 'addAlert').and.callFake(data => data);
        spyOn($ctrl, 'gettext').and.callFake(data => data);
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
        it('should recalculate goal', done => {
            $ctrl.changeGoal().then(() => {
                expect($ctrl.changePercentage).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('changePercentage', () => {
        it('should recalculate percentageRaised', () => {
            $ctrl.donationsSum = 2000;
            $ctrl.appeal = {amount: 5000};
            $ctrl.changePercentage();
            expect($ctrl.percentageRaised).toEqual(40);
        });
    });
    describe('save', () => {
        const appeal = { id: 3 };
        beforeEach(() => {
            $ctrl.appeal = appeal;
        });
        it('should call the api', () => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.save();
            expect(api.put).toHaveBeenCalledWith(`appeals/${appeal.id}`, appeal);
        });
        it('should alert success', done => {
            spyOn(api, 'put').and.callFake(() => Promise.resolve());
            $ctrl.save().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Appeal saved successfully');
                expect($ctrl.gettext).toHaveBeenCalledWith('Appeal saved successfully');
                done();
            });
        });
        it('should alert failure', done => {
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
            $ctrl.appeal = {id: 123};
        });
        it('should add the contact to the appeal', () => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.onContactSelected({id: 1});
            expect(api.post).toHaveBeenCalledWith(`appeals/123/contacts/1`);
        });
        it('should alert success', done => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.onContactSelected({id: 1}).then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith('Contact successfully added to appeal');
                expect($ctrl.gettext).toHaveBeenCalledWith('Contact successfully added to appeal');
                done();
            });
        });
        it('should alert failure', done => {
            spyOn(api, 'post').and.callFake(() => Promise.reject());
            $ctrl.onContactSelected({id: 1}).catch(() => {
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
                    {contact: {id: 1}},
                    {contact: {id: 2}}
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
                    {contact: {id: 1}},
                    {contact: {id: 2}}
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
                {id: 1},
                {id: 2}
            ];
            $ctrl.selectAllNotGiven();
            expect($ctrl.selectedContactIds).toEqual([1, 2]);
        });
    });
    describe('deselectAllNotGiven', () => {
        it('should remove contact ids', () => {
            $ctrl.selectedContactIds = [1, 2, 3];
            $ctrl.contactsNotGiven = [
                {id: 1},
                {id: 2}
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
            serverConstants.data.pledge_currencies = [{code: 'USD', symbol: '$'}];
            expect($ctrl.getCurrencyFromCode('USD')).toEqual({code: 'USD', symbol: '$'});
        });
    });
    describe('addDonation', () => {
        it('open donation modal with the appeal pre-filled', () => {
            spyOn(donations, 'openDonationModal').and.callFake(() => {});
            $ctrl.appeal = {id: 1, name: 'a'};
            $ctrl.addDonation();
            expect(donations.openDonationModal).toHaveBeenCalledWith({appeal: $ctrl.appeal});
        });
    });
    describe('editDonation', () => {
        it('open donation modal with the appeal pre-filled', () => {
            spyOn(donations, 'openDonationModal').and.callFake(() => {});
            $ctrl.appeal = {id: 1, name: 'a'};
            $ctrl.editDonation({id: 123});
            expect(donations.openDonationModal).toHaveBeenCalledWith({id: 123, appeal: $ctrl.appeal});
        });
    });
    describe('exportToCSV', () => {
        it('should build a csv export table', () => {
            spyOn($ctrl, 'getSelectedDonationContacts').and.callFake(() => [[{contact: {id: 1, name: 'a'}}]]);
            spyOn($ctrl, 'getSelectedContactsNotGiven').and.callFake(() => [[{id: 2, name: 'a'}]]);
            $ctrl.selectedContactIds = [1, 2];
            expect($ctrl.exportToCSV()).toEqual([['Contact', 'Commitment', 'Donations'], [{contact: {id: 1, name: 'a'}}], [{id: 2, name: 'a'}]]);
        });
    });
    describe('getSelectedDonationContacts', () => {
        it('should get donation contacts', () => {
            $ctrl.selectedContactIds = [1, 2];
            $ctrl.appeal = {donations: [{contact: {id: 1, name: 'a'}}, {contact: {id: 3, name: 'b'}}]};
            spyOn($ctrl, 'mutateDonation').and.callFake(data => data);
            expect($ctrl.getSelectedDonationContacts()).toEqual([{contact: {id: 1, name: 'a'}}]);
        });
    });
    describe('getSelectedContactsNotGiven', () => {
        it('should get contacts', () => {
            $ctrl.selectedContactIds = [1, 2];
            $ctrl.contactsNotGiven = [{id: 1, name: 'a'}, {id: 3}];
            spyOn($ctrl, 'mutateContact').and.callFake(data => data);
            expect($ctrl.getSelectedContactsNotGiven()).toEqual([{id: 1, name: 'a'}]);
        });
    });
    describe('mutateContact', () => {
        it('should build a contact array', () => {
            spyOn(serverConstants, 'getPledgeFrequency').and.callFake(() => { return {value: 'Monthly'}; });
            const contact = {name: 'a b', pledge_amount: 25.25, pledge_frequency: 1, currency: {symbol: '$'}};
            expect($ctrl.mutateContact(contact)).toEqual([['a b', '$25.25 Monthly']]);
        });
    });
    describe('mutateDonation', () => {
        it('should build a donation array', () => {
            const donation = {contact: {name: 'a b', pledge_amount: 25.25}, amount: 12.5, currency: 'NZD', donation_date: '2004'};
            expect($ctrl.mutateDonation(donation)).toEqual([['a b', 25.25, '12.5 NZD 2004']]);
        });
    });
});
