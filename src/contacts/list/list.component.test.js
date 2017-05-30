import list from './list.component';
import assign from 'lodash/fp/assign';

describe('contacts.list.component', () => {
    let $ctrl, contacts, contactsTags, rootScope, scope, componentController, modal, tasks, alerts, gettextCatalog, api;
    beforeEach(() => {
        angular.mock.module(list);
        inject(($componentController, $rootScope, _contacts_, _contactsTags_, _modal_, _tasks_, _alerts_, _gettextCatalog_, _api_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            contacts = _contacts_;
            contactsTags = _contactsTags_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            tasks = _tasks_;
            componentController = $componentController;
            api.account_list_id = 1234;
            loadController();
        });
    });
    function loadController() {
        $ctrl = componentController('contactsList', {$scope: scope}, {view: null, selected: null});
    }
    describe('constructor', () => {
        beforeEach(() => {
            spyOn(contacts, 'clearSelectedContacts').and.callFake(() => {});
        });
        it('should clear selected contacts', () => {
            loadController();
            expect(contacts.clearSelectedContacts).toHaveBeenCalled();
        });
        it('should set default values', () => {
            expect($ctrl.allSelected).toBeFalsy();
            expect($ctrl.data).toEqual([]);
            expect($ctrl.listLoadCount).toEqual(0);
            expect($ctrl.loading).toBeFalsy();
            expect($ctrl.meta).toEqual({});
            expect($ctrl.models).toEqual({
                addTags: {
                    newTag: ''
                }
            });
            expect($ctrl.page).toEqual(0);
            expect($ctrl.totalContactCount).toEqual(0);
        });
    });
    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => new Promise((resolve) => resolve));
        });
        it('should call load', () => {
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalled();
        });
    });
    describe('events', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => new Promise((resolve) => resolve));
            spyOn(contactsTags, 'load').and.callFake(() => Promise.resolve());
            spyOn(contacts, 'clearSelectedContacts').and.callFake(() => {});
        });
        it('should fire contacts.load on contactCreated', () => {
            rootScope.$emit('contactCreated');
            scope.$digest();
            expect($ctrl.load).toHaveBeenCalledWith();
        });
        //xit until fix org_accounts accountListUpdated to not fire in service
        xit('should fire contacts.load on accountListUpdated', () => {
            rootScope.$emit('accountListUpdated');
            scope.$digest();
            expect($ctrl.load).toHaveBeenCalled();
            expect(contacts.clearSelectedContacts).toHaveBeenCalled();
        });
        it('should fire contacts.load on contactsFilterChange', () => {
            rootScope.$emit('contactsFilterChange');
            scope.$digest();
            expect($ctrl.load).toHaveBeenCalledWith();
            expect(contacts.clearSelectedContacts).toHaveBeenCalled();
        });
        it('should fire contacts.load on contactsTagsChange', () => {
            rootScope.$emit('contactsTagsChange');
            scope.$digest();
            expect($ctrl.load).toHaveBeenCalledWith();
            expect(contacts.clearSelectedContacts).toHaveBeenCalled();
        });
    });
    describe('loadMoreContacts', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => new Promise((resolve) => resolve));
            $ctrl.page = 0;
            $ctrl.loading = false;
            $ctrl.meta = {pagination: {total_pages: 4}};
        });
        it('should increment the current page by 1', () => {
            $ctrl.loadMoreContacts();
            expect($ctrl.page).toEqual(1);
        });
        it('should call load', () => {
            $ctrl.loadMoreContacts();
            expect($ctrl.load).toHaveBeenCalledWith($ctrl.page);
        });
        it('should exit if already loading', () => {
            $ctrl.loading = true;
            $ctrl.loadMoreContacts();
            expect($ctrl.load).not.toHaveBeenCalled();
        });
        it('should exit if on last page of results', () => {
            $ctrl.page = 4;
            $ctrl.loadMoreContacts();
            expect($ctrl.load).not.toHaveBeenCalled();
        });
    });
    describe('toggleAllContacts', () => {
        beforeEach(() => {
            $ctrl.data = [{id: 1}];
            spyOn($ctrl, 'selectAllContacts').and.callFake(() => {});
            spyOn(contacts, 'clearSelectedContacts').and.callFake(() => {});
        });
        it('should call selectAllContacts if all contacts are not selected', () => {
            contacts.selectedContacts = [];
            $ctrl.toggleAllContacts();
            expect($ctrl.selectAllContacts).toHaveBeenCalledWith(false);
        });
        it('should call clearSelectedContacts if all contacts are selected', () => {
            contacts.selectedContacts = [1];
            $ctrl.toggleAllContacts();
            expect(contacts.clearSelectedContacts).toHaveBeenCalledWith();
        });
    });
    describe('hideContact', () => {
        let contact = {id: 1, name: 'a'};
        beforeEach(() => {
            $ctrl.data = [contact];
            spyOn(contacts, 'hideContact').and.callFake(() => new Promise(resolve => resolve()));
        });
        it('should call contacts.hideContact', () => {
            $ctrl.data = [{id: 1}];
            $ctrl.hideContact(contact);
            expect(contacts.hideContact).toHaveBeenCalledWith(contact);
        });
        it('should remove the contact from data', (done) => {
            $ctrl.hideContact(contact).then(() => {
                expect($ctrl.data).toEqual([]);
                done();
            });
        });
    });
    describe('openAddTagModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
        });
        it('should open the add tag modal', () => {
            $ctrl.openAddTagModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../sidebar/filter/tags/add/add.html'),
                controller: 'addTagController',
                locals: {
                    selectedContacts: contacts.selectedContacts
                }
            });
        });
    });
    describe('openRemoveTagModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
        });
        it('should open the remove tag modal', () => {
            $ctrl.openRemoveTagModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../sidebar/filter/tags/remove/remove.html'),
                controller: 'removeTagController',
                locals: {
                    selectedContacts: $ctrl.getSelectedContacts(),
                    currentListSize: $ctrl.data.length
                }
            });
        });
    });
    describe('openAddTaskModal', () => {
        beforeEach(() => {
            spyOn(tasks, 'addModal').and.callFake(() => {});
        });
        it('should open the add task modal', () => {
            $ctrl.openAddTaskModal();
            expect(tasks.addModal).toHaveBeenCalledWith($ctrl.contacts.selectedContacts);
        });
    });
    describe('openLogTaskModal', () => {
        beforeEach(() => {
            spyOn(tasks, 'logModal').and.callFake(() => {});
        });
        it('should open the log task modal', () => {
            $ctrl.openLogTaskModal();
            expect(tasks.logModal).toHaveBeenCalledWith($ctrl.contacts.selectedContacts);
        });
    });
    describe('openEditFieldsModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
        });
        it('should open the edit fields modal', () => {
            $ctrl.openEditFieldsModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./editFields/editFields.html'),
                controller: 'editFieldsController',
                locals: {
                    selectedContacts: $ctrl.getSelectedContacts()
                }
            });
        });
    });
    describe('openMergeContactsModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
            spyOn(alerts, 'addAlert').and.callFake(() => {});
            spyOn(gettextCatalog, 'getPlural').and.callFake(() => {});
            contacts.selectedContacts = [1, 2];
        });
        it('should open the merge contacts modal', () => {
            $ctrl.openMergeContactsModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./mergeContacts/mergeContacts.html'),
                controller: 'mergeContactsController',
                locals: {
                    selectedContacts: $ctrl.getSelectedContacts()
                }
            });
        });
        it('should alert if less than 2 contacts are selected', () => {
            contacts.selectedContacts = [1];
            $ctrl.openMergeContactsModal();
            expect(alerts.addAlert).toHaveBeenCalledWith(gettextCatalog.getPlural(2, jasmine.any(String), jasmine.any(String), {}), 'danger');
        });
        it('should alert if more than 8 contacts are selected', () => {
            contacts.selectedContacts = [1];
            $ctrl.openMergeContactsModal();
            expect(alerts.addAlert).toHaveBeenCalledWith(gettextCatalog.getPlural(8, jasmine.any(String), jasmine.any(String), {}), 'danger');
        });
    });
    describe('openExportContactsModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
        });
        it('should open the export contacts modal', () => {
            $ctrl.openExportContactsModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./exportContacts/exportContacts.html'),
                controller: 'exportContactsController',
                locals: {
                    selectedContactIds: $ctrl.contacts.selectedContacts
                }
            });
        });
    });
    describe('openMapContactsModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
        });
        it('should open the map contacts modal', () => {
            $ctrl.openMapContactsModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./mapContacts/mapContacts.html'),
                controller: 'mapContactsController',
                locals: {
                    selectedContacts: $ctrl.getSelectedContacts()
                }
            });
        });
    });
    describe('load', () => {
        const defaultRequest = {
            url: 'contacts',
            data: {
                filter: {},
                page: 1,
                per_page: jasmine.any(Number),
                include: 'addresses,people,people.facebook_accounts,people.phone_numbers,people.email_addresses',
                fields: {
                    contact: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol,pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,people',
                    people: 'deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers',
                    addresses: 'city,geo,historic,primary_mailing_address,postal_code,state,source,street',
                    email_addresses: 'email,historic,primary',
                    phone_numbers: 'historic,location,number,primary',
                    facebook_accounts: 'username'
                },
                sort: 'name'
            },
            overrideGetAsPost: true
        };
        const contact = {id: 1, name: 'a'};
        beforeEach(() => {
            spyOn(contacts, 'buildFilterParams').and.callFake(() => { return {}; });
            spyOn(api, 'get').and.callFake(() => new Promise((resolve) => { resolve([contact]); }));
            $ctrl.page = 1;
        });
        it('should set the loading flag', () => {
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });
        it('should set reset the data on page 1', () => {
            $ctrl.load();
            expect($ctrl.data).toEqual(null);
        });
        it('should default to the first page', () => {
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith(assign(defaultRequest, {data: assign(defaultRequest.data, {page: 1})}));
            scope.$digest();
        });
        it('should request the page of the param', () => {
            $ctrl.load(2);
            expect(api.get).toHaveBeenCalledWith(assign(defaultRequest, {data: assign(defaultRequest.data, {page: 2})}));
        });
        it('should increment listLoadCount', () => {
            const initialCount = angular.copy($ctrl.listLoadCount);
            $ctrl.load();
            expect($ctrl.listLoadCount).toEqual(initialCount + 1);
        });
        it('should build the filter from contacts.buildFilterParams', () => {
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith(defaultRequest);
            expect(contacts.buildFilterParams).toHaveBeenCalled();
        });
        xit('should unflag loading after load', done => {
            $ctrl.load().then(() => {
                expect($ctrl.loading).toBeFalsy();
                done();
            });
        });
        xit('should set contacts on page 1', (done) => {
            $ctrl.data = [{id: 2, name: 'b'}];
            $ctrl.load().then(() => {
                expect($ctrl.data).toEqual([contact]);
                done();
            });
        });
        xit('should union contacts on page 2', (done) => {
            $ctrl.data = [{id: 2, name: 'b'}, {id: 1, name: 'b'}];
            $ctrl.load(2).then(() => {
                expect($ctrl.data).toEqual([{id: 2, name: 'b'}, contact]);
                done();
            });
        });
        xit('should return data', (done) => {
            $ctrl.load().then(data => {
                expect(data).toBeDefined();
                done();
            });
        });
    });
    xdescribe('load - no results', () => {
        it('should call getTotalCount if no results', (done) => {
            spyOn(api, 'get').and.callFake(() => new Promise((resolve) => { resolve([]); }));
            spyOn($ctrl, 'getTotalCount').and.callFake(() => {});
            $ctrl.load().then(() => {
                done();
            });
            expect($ctrl.getTotalCount).toHaveBeenCalled();
        });
    });
    describe('getSelectedContacts', () => {
        it('should get contacts for selected ids', () => {
            contacts.selectedContacts = [1, 2];
            $ctrl.data = [{id: 1, name: 'a'}, {id: 2, name: 'b'}];
            expect($ctrl.getSelectedContacts()).toEqual($ctrl.data);
        });
    });
    xdescribe('selectAllContacts', () => { //spread operator fails in karma/phantomjs
        const data = [{id: 1, name: 'a'}, {id: 2, name: 'b'}];
        beforeEach(() => {
            spyOn($ctrl, 'getCompleteFilteredList').and.callFake(() => Promise.resolve([data]));
        });
        it('should map data ids to contacts.selectedContacts', () => {
            $ctrl.data = data;
            $ctrl.selectAllContacts();
            expect(contacts.selectedContacts).toEqual([1, 2]);
        });
        it('should get complete list of ids for contacts.selectedContacts', (done) => {
            $ctrl.data = [];
            $ctrl.selectAllContacts().then(() => {
                done();
            });
            expect(contacts.selectedContacts).toEqual([1, 2]);
        });
    });
    describe('bulkHideContacts', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(contacts, 'bulkSave').and.callFake(() => Promise.resolve());
            spyOn(gettextCatalog, 'getString').and.callFake(() => {});
        });
        it('should call a translated confirm message', () => {
            $ctrl.bulkHideContacts();
            expect(modal.confirm).toHaveBeenCalled();
            expect(gettextCatalog.getString).toHaveBeenCalled();
        });
        it('should save selected contacts as hidden', (done) => {
            contacts.selectedContacts = [1, 2];
            $ctrl.bulkHideContacts().then(() => {
                expect(contacts.bulkSave).toHaveBeenCalledWith([{id: 1, status: 'Never Ask'}, {id: 2, status: 'Never Ask'}]);
                done();
            });
        });
        it('should hide the contacts from view', (done) => {
            $ctrl.data = [{id: 1, status: 'Never Ask'}, {id: 1, status: 'Never Ask'}];
            contacts.selectedContacts = [1, 2];
            $ctrl.bulkHideContacts().then(() => {
                expect($ctrl.data).toEqual([]);
                done();
            });
        });
    });
    describe('getCompleteFilteredList', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
        });
        it('should get a complete list of ids', () => {
            $ctrl.getCompleteFilteredList();
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts',
                data: {
                    filter: contacts.buildFilterParams(),
                    fields: {
                        contacts: ''
                    },
                    per_page: 25000
                },
                overrideGetAsPost: true
            });
        });
    });
    describe('getTotalCount', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({meta: {pagination: {total_count: 2}}}));
        });
        it('should get a count of contacts in account list', (done) => {
            $ctrl.getTotalCount().then(() => {
                done();
                expect($ctrl.totalContactCount).toEqual(2);
            });
            expect(api.get).toHaveBeenCalledWith('contacts', {
                filter: {
                    account_list_id: api.account_list_id
                },
                per_page: 0
            });
        });
    });
});
