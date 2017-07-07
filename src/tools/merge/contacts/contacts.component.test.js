import component from './contacts.component';

describe('tools.mergeContacts.component', () => {
    let $ctrl, rootScope, scope, componentController, alerts, gettextCatalog, state, api, contacts;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _alerts_, _gettextCatalog_, $state, _api_, _contacts_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            contacts = _contacts_;
            gettextCatalog = _gettextCatalog_;
            state = $state;
            componentController = $componentController;
            $ctrl = componentController('mergeContacts', {$scope: scope}, {});
        });
        spyOn($ctrl.blockUI, 'reset').and.callFake(() => {});
    });
    describe('events', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve({}));
        });
        it('will reload on accountListUpdated', () => {
            rootScope.$emit('accountListUpdated');
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });
    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve({}));
        });
        it('will call load', () => {
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });
    describe('select', () => {
        let duplicate;
        beforeEach(() => {
            duplicate = {contacts: [{id: 1}, {id: 2}]};
        });
        it('should pick winner 1', () => {
            $ctrl.select(duplicate, 0);
            expect(duplicate.ignored).toBeFalsy();
            expect(duplicate.contacts[0].selected).toBeTruthy();
            expect(duplicate.contacts[1].selected).toBeFalsy();
        });
        it('should pick winner 2', () => {
            $ctrl.select(duplicate, 1);
            expect(duplicate.ignored).toBeFalsy();
            expect(duplicate.contacts[1].selected).toBeTruthy();
            expect(duplicate.contacts[0].selected).toBeFalsy();
        });
    });
    describe('deSelect', () => {
        let duplicate;
        beforeEach(() => {
            duplicate = {contacts: [{id: 1}, {id: 2}]};
        });
        it('should set ignored', () => {
            $ctrl.deSelect(duplicate);
            expect(duplicate.ignored).toBeTruthy();
            expect(duplicate.contacts[0].selected).toBeFalsy();
            expect(duplicate.contacts[1].selected).toBeFalsy();
        });
    });
    describe('confirm', () => {
        afterEach(() => {
            rootScope.$apply(); // for return Promise.all
        });
        beforeEach(() => {
            spyOn($ctrl.blockUI, 'start').and.callFake(() => {});
            spyOn($ctrl, 'merge').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'ignore').and.callFake(() => Promise.resolve());
        });
        it('should show loading screen', () => {
            $ctrl.confirm();
            expect($ctrl.blockUI.start).toHaveBeenCalledWith();
        });
        it('should handle bulk merging of contacts', () => {
            $ctrl.duplicates = [{contacts: [{id: 1, selected: true}, {id: 2}]}, {contacts: [{id: 3}, {id: 4, selected: true}]}];
            $ctrl.confirm();
            expect($ctrl.merge).toHaveBeenCalledWith([{contacts: [{id: 1, selected: true}, {id: 2}]}, {contacts: [{id: 3}, {id: 4, selected: true}]}]);
        });
        it('should handle multiple ignores', () => {
            $ctrl.duplicates = [{ignored: true, contacts: [{id: 1}, {id: 2}]}, {contacts: [{id: 3}, {id: 4}]}, {ignored: true, contacts: [{id: 4}, {id: 5}]}];
            $ctrl.confirm();
            expect($ctrl.ignore).toHaveBeenCalledWith([{ignored: true, contacts: [{id: 1}, {id: 2}]}, {ignored: true, contacts: [{id: 4}, {id: 5}]}]);
        });
        it('should show a translated alert on completion', done => {
            spyOn(alerts, 'addAlert').and.callFake(data => data);
            spyOn(gettextCatalog, 'getString').and.callThrough();
            $ctrl.confirm().then(() => {
                expect(alerts.addAlert).toHaveBeenCalledWith(jasmine.any(String));
                expect(gettextCatalog.getString).toHaveBeenCalledWith(jasmine.any(String));
                done();
            });
        });
    });
    describe('confirmAndContinue', () => {
        beforeEach(() => {
            spyOn($ctrl, 'confirm').and.callFake(() => Promise.resolve());
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
        });
        it('should call confirm', () => {
            $ctrl.confirmAndContinue();
            expect($ctrl.confirm).toHaveBeenCalledWith();
        });
        it('should reload new contacts', done => {
            $ctrl.confirmAndContinue().then(() => {
                expect($ctrl.load).toHaveBeenCalledWith();
                done();
            });
        });
        it('should hide the load screen', done => {
            $ctrl.confirmAndContinue().then(() => {
                expect($ctrl.blockUI.reset).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('confirmThenLeave', () => {
        beforeEach(() => {
            spyOn($ctrl, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(state, 'go').and.callFake(() => {});
        });
        it('should call confirm', () => {
            $ctrl.confirmThenLeave();
            expect($ctrl.confirm).toHaveBeenCalledWith();
        });
        it('should navigate to tools homepage', done => {
            $ctrl.confirmThenLeave().then(() => {
                expect(state.go).toHaveBeenCalledWith('tools');
                done();
            });
        });
        it('should hide the load screen', done => {
            $ctrl.confirmThenLeave().then(() => {
                expect($ctrl.blockUI.reset).toHaveBeenCalledWith();
                done();
            });
        });
    });
    describe('ignore', () => {
        it('should create an array of api delete promises', () => {
            spyOn(api, 'delete').and.callFake(() => Promise.resolve());
            expect($ctrl.ignore([{id: 1}, {id: 2}])).toEqual([jasmine.any(Promise), jasmine.any(Promise)]);
            expect(api.delete).toHaveBeenCalledWith({url: `contacts/duplicates/1`, type: 'contacts'});
            expect(api.delete).toHaveBeenCalledWith({url: `contacts/duplicates/2`, type: 'contacts'});
        });
    });
    describe('merge', () => {
        it('should call bulkMerge with data', () => {
            spyOn(contacts, 'merge').and.callFake(() => Promise.resolve());
            $ctrl.merge([{contacts: [{id: 1, selected: true}, {id: 2}]}, {contacts: [{id: 3}, {id: 4, selected: true}]}]);
            expect(contacts.merge).toHaveBeenCalledWith([
                {winner_id: 1, loser_id: 2},
                {winner_id: 4, loser_id: 3}
            ]);
        });
    });
    describe('load', () => {
        beforeEach(() => {
            $ctrl.duplicates = [{contacts: [{id: 1}, {id: 2}]}];
        });
        it('should reset duplicates', () => {
            $ctrl.load();
            expect($ctrl.duplicates).toEqual([]);
        });
        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith('contacts/duplicates', {
                include: 'contacts,contacts.addresses',
                fields: {
                    contacts: 'addresses,name,square_avatar,status,created_at',
                    addresses: 'city,postal_code,primary_mailing_address,state,street,source'
                },
                filter: {account_list_id: api.account_list_id},
                per_page: 5
            });
        });
        it('should grab total', done => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({meta: {pagination: {total_count: 2}}}));
            $ctrl.load().then(() => {
                expect($ctrl.total).toEqual(2);
                done();
            });
        });
        it('should map data', done => {
            let data = [{id: 1}];
            data.meta = {pagination: {total_count: 2}};
            spyOn(api, 'get').and.callFake(() => Promise.resolve(data));
            $ctrl.load().then(() => {
                expect($ctrl.duplicates).toEqual(data);
                done();
            });
        });
    });
});
