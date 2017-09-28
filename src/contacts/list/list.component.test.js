import list from './list.component';
import assign from 'lodash/fp/assign';

describe('contacts.list.component', () => {
    let $ctrl, contacts, contactsTags, rootScope, scope, componentController, modal, tasks, alerts, gettextCatalog,
        api, serverConstants;
    beforeEach(() => {
        angular.mock.module(list);
        inject((
            $componentController, $rootScope, _contacts_, _contactsTags_, _modal_, _tasks_, _alerts_,
            _gettextCatalog_, _api_, _serverConstants_
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            contacts = _contacts_;
            contactsTags = _contactsTags_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            tasks = _tasks_;
            serverConstants = _serverConstants_;
            componentController = $componentController;
            api.account_list_id = 1234;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(gettextCatalog, 'getPlural').and.callFake((data) => data);
    });

    function loadController() {
        $ctrl = componentController('contactsList', { $scope: scope }, { view: null, selected: null });
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
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
        });
        afterEach(() => {
            $ctrl.$onDestroy();
        });
        it('should call load', () => {
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalled();
        });
        describe('events', () => {
            beforeEach(() => {
                $ctrl.$onInit();
                spyOn(contactsTags, 'load').and.callFake(() => Promise.resolve());
                spyOn(contacts, 'clearSelectedContacts').and.callFake(() => {});
            });
            it('should fire contacts.load on contactCreated', () => {
                rootScope.$emit('contactCreated');
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalledWith();
            });
            it('should fire contacts.load on accountListUpdated', () => {
                rootScope.$emit('accountListUpdated');
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalled();
                expect(contacts.clearSelectedContacts).toHaveBeenCalled();
            });
            it('should fire contacts.load on contactsFilterChange', () => {
                rootScope.$emit('contactsFilterChange');
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalledWith();
                expect(contacts.clearSelectedContacts).toHaveBeenCalled();
            });
            it('should fire contacts.load on contactsTagsChange', () => {
                rootScope.$emit('contactsTagsChange');
                rootScope.$digest();
                expect($ctrl.load).toHaveBeenCalledWith();
                expect(contacts.clearSelectedContacts).toHaveBeenCalled();
            });
            it('should clear contacts on contactTagsAdded', () => {
                rootScope.$emit('contactTagsAdded');
                rootScope.$digest();
                expect(contacts.clearSelectedContacts).toHaveBeenCalled();
            });
            it('should clear contacts on contactTagDeleted', () => {
                rootScope.$emit('contactTagDeleted');
                rootScope.$digest();
                expect(contacts.clearSelectedContacts).toHaveBeenCalled();
            });
            it('should clear contacts on taskAdded', () => {
                rootScope.$emit('taskAdded');
                rootScope.$digest();
                expect(contacts.clearSelectedContacts).toHaveBeenCalled();
            });
            it('should clear contacts on taskLogged', () => {
                rootScope.$emit('taskLogged');
                rootScope.$digest();
                expect(contacts.clearSelectedContacts).toHaveBeenCalled();
            });
        });
    });
    describe('$onDestroy', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        it('should remove watchers', () => {
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            spyOn($ctrl, 'watcher3').and.callFake(() => {});
            spyOn($ctrl, 'watcher4').and.callFake(() => {});
            spyOn($ctrl, 'watcher5').and.callFake(() => {});
            spyOn($ctrl, 'watcher6').and.callFake(() => {});
            spyOn($ctrl, 'watcher7').and.callFake(() => {});
            spyOn($ctrl, 'watcher8').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
            expect($ctrl.watcher3).toHaveBeenCalledWith();
            expect($ctrl.watcher4).toHaveBeenCalledWith();
            expect($ctrl.watcher5).toHaveBeenCalledWith();
            expect($ctrl.watcher6).toHaveBeenCalledWith();
            expect($ctrl.watcher7).toHaveBeenCalledWith();
            expect($ctrl.watcher8).toHaveBeenCalledWith();
        });
    });
    describe('loadMoreContacts', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            $ctrl.page = 0;
            $ctrl.loading = false;
            $ctrl.meta = { pagination: { total_pages: 4 } };
        });
        it('should call load', () => {
            $ctrl.loadMoreContacts();
            expect($ctrl.load).toHaveBeenCalledWith(1);
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
            $ctrl.data = [{ id: 1 }];
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
        it('should call clearSelectedContacts if contacts are undefined', () => {
            contacts.selectedContacts = null;
            $ctrl.toggleAllContacts();
            expect(contacts.clearSelectedContacts).toHaveBeenCalledWith();
        });
        it('should call clearSelectedContacts if no data', () => {
            contacts.selectedContacts = [1];
            $ctrl.data = null;
            $ctrl.toggleAllContacts();
            expect(contacts.clearSelectedContacts).toHaveBeenCalledWith();
        });
    });
    describe('hideContact', () => {
        let contact = { id: 1, name: 'a' };
        beforeEach(() => {
            $ctrl.data = [contact];
            spyOn(contacts, 'hideContact').and.callFake(() => new Promise((resolve) => resolve()));
        });
        it('should call contacts.hideContact', () => {
            $ctrl.data = [{ id: 1 }];
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
            expect(tasks.addModal).toHaveBeenCalledWith({ contactsList: $ctrl.contacts.selectedContacts });
        });
    });
    describe('openEditFieldsModal', () => {
        it('should open the edit fields modal', () => {
            spyOn(modal, 'open').and.callFake(() => {});
            spyOn(serverConstants, 'load').and.callThrough();
            $ctrl.openEditFieldsModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./editFields/editFields.html'),
                controller: 'editFieldsController',
                locals: {
                    selectedContacts: $ctrl.getSelectedContacts()
                },
                resolve: {
                    0: jasmine.any(Function)
                }
            });
        });
    });
    describe('openMergeContactsModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
            spyOn(alerts, 'addAlert').and.callFake(() => {});
            contacts.selectedContacts = [1, 2];
        });
        it('should open the merge contacts modal', () => {
            $ctrl.openMergeContactsModal();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./merge/merge.html'),
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
            expect(gettextCatalog.getPlural).toHaveBeenCalledWith(2, jasmine.any(String), jasmine.any(String), {});
        });
        it('should alert if more than 8 contacts are selected', () => {
            contacts.selectedContacts = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            $ctrl.openMergeContactsModal();
            expect(alerts.addAlert).toHaveBeenCalledWith(gettextCatalog.getPlural(8, jasmine.any(String), jasmine.any(String), {}), 'danger');
            expect(gettextCatalog.getPlural).toHaveBeenCalledWith(8, jasmine.any(String), jasmine.any(String), {});
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
                template: require('./map/map.html'),
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
                    contact: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol,pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,people,created_at,late_at',
                    people: 'deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers',
                    addresses: 'city,geo,historic,primary_mailing_address,postal_code,state,source,street,updated_at',
                    email_addresses: 'email,historic,primary',
                    phone_numbers: 'historic,location,number,primary',
                    facebook_accounts: 'username'
                },
                sort: 'name'
            },
            overrideGetAsPost: true
        };
        let contact = { id: 1, name: 'a' };
        let result = [contact];
        result.meta = {
            to: 1,
            pagination: { page: 1 }
        };
        beforeEach(() => {
            spyOn(contacts, 'buildFilterParams').and.callFake(() => { return {}; });
            $ctrl.page = 1;
            $ctrl.listLoadCount = 1;
        });
        it('should set the loading flag', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });
        it('should set reset the data on page 1', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            $ctrl.load();
            expect($ctrl.data).toEqual(null);
        });
        it('should default to the first page', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith(assign(defaultRequest, {
                data: assign(defaultRequest.data, { page: 1 })
            }));
            scope.$digest();
        });
        it('should request the page of the param', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            $ctrl.load(2);
            expect(api.get).toHaveBeenCalledWith(assign(defaultRequest, {
                data: assign(defaultRequest.data, { page: 2 })
            }));
        });
        it('should increment listLoadCount', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            const initialCount = angular.copy($ctrl.listLoadCount);
            $ctrl.load();
            expect($ctrl.listLoadCount).toEqual(initialCount + 1);
        });
        it('should build the filter from contacts.buildFilterParams', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith(defaultRequest);
            expect(contacts.buildFilterParams).toHaveBeenCalled();
        });
        it('should unflag loading after load', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            $ctrl.load().then(() => {
                expect($ctrl.loading).toBeFalsy();
                done();
            });
        });
        it('should set contacts on page 1', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            $ctrl.data = [{ id: 2, name: 'b' }];
            $ctrl.load().then(() => {
                expect($ctrl.data).toEqual([contact]);
                done();
            });
        });
        it('should union contacts on page 2', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            $ctrl.data = [{ id: 2, name: 'b' }, { id: 1, name: 'b' }];
            $ctrl.load(2).then(() => {
                expect($ctrl.data[1].name).toEqual('b');
                done();
            });
        });
        it('should return data', (done) => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            $ctrl.load().then((data) => {
                expect(data).toBeDefined();
                done();
            });
        });
        it('should handle late prior results', (done) => {
            let call = 0;
            spyOn(api, 'get').and.callFake(() => {
                if (call === 0) {
                    call++;
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(result);
                        }, 1000);
                    });
                } else {
                    return Promise.resolve(result);
                }
            });
            $ctrl.load().then((data) => {
                done();
                expect(data).toBeUndefined();
            });
            $ctrl.load();
        });
    });
    describe('load - no results', () => {
        it('should call getTotalCount if no results', (done) => {
            let result = [];
            result.meta = {
                to: 0,
                pagination: { page: 1 }
            };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(result));
            spyOn($ctrl, 'getTotalCount').and.callFake(() => {});
            $ctrl.load().then(() => {
                expect($ctrl.getTotalCount).toHaveBeenCalled();
                done();
            });
        });
    });
    describe('getSelectedContacts', () => {
        it('should get contacts for selected ids', () => {
            contacts.selectedContacts = [1, 2];
            $ctrl.data = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
            expect($ctrl.getSelectedContacts()).toEqual($ctrl.data);
        });
    });
    describe('selectAllContacts', () => { // spread operator fails in karma/phantomjs
        const data = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
        beforeEach(() => {
            spyOn($ctrl, 'getCompleteFilteredList').and.callFake(() => Promise.resolve(data));
        });
        it('should map data ids to contacts.selectedContacts', () => {
            $ctrl.data = data;
            $ctrl.selectAllContacts(false);
            expect(contacts.selectedContacts).toEqual([1, 2]);
        });
        it('should get complete list of ids for contacts.selectedContacts', (done) => {
            $ctrl.data = [];
            $ctrl.selectAllContacts().then(() => {
                expect(contacts.selectedContacts).toEqual([1, 2]);
                done();
            });
        });
    });
    describe('bulkHideContacts', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
            spyOn(contacts, 'bulkSave').and.callFake(() => Promise.resolve());
        });
        it('should call a translated confirm message', () => {
            $ctrl.bulkHideContacts();
            expect(modal.confirm).toHaveBeenCalled();
            expect(gettextCatalog.getString).toHaveBeenCalled();
        });
        it('should save selected contacts as hidden', (done) => {
            contacts.selectedContacts = [1, 2];
            $ctrl.bulkHideContacts().then(() => {
                expect(contacts.bulkSave).toHaveBeenCalledWith([{ id: 1, status: 'Never Ask' }, { id: 2, status: 'Never Ask' }]);
                done();
            });
        });
        it('should hide the contacts from view', (done) => {
            $ctrl.data = [{ id: 1, status: 'Never Ask' }, { id: 1, status: 'Never Ask' }];
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
            spyOn(api, 'get').and.callFake(() => Promise.resolve({ meta: { pagination: { total_count: 2 } } }));
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
