import { assign, map } from 'lodash/fp';
import list from './list.component';

describe('contacts.list.component', () => {
    let $ctrl, contacts, contactsTags, rootScope, scope, componentController, modal, tasks, alerts, gettextCatalog,
        api, serverConstants, users, contactFilter, state, q;

    function loadController() {
        $ctrl = componentController('contactsList', { $scope: scope }, { view: null, selected: null });
    }

    beforeEach(() => {
        angular.mock.module(list);
        inject((
            $componentController, $rootScope, _contacts_, _contactsTags_, _modal_, _tasks_, _alerts_,
            _gettextCatalog_, _api_, _serverConstants_, _users_, _contactFilter_, $state, $q
        ) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            alerts = _alerts_;
            api = _api_;
            state = $state;
            contacts = _contacts_;
            contactsTags = _contactsTags_;
            contactFilter = _contactFilter_;
            gettextCatalog = _gettextCatalog_;
            modal = _modal_;
            tasks = _tasks_;
            serverConstants = _serverConstants_;
            users = _users_;
            q = $q;
            componentController = $componentController;
            api.account_list_id = 1234;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
        spyOn(gettextCatalog, 'getPlural').and.callFake((data) => data);
    });

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

        it('should default page size to 25', () => {
            expect($ctrl.pageSize).toEqual(25);
        });

        it('should set page size to user option', () => {
            users.currentOptions = {
                'page_size_contacts': { value: 10 }
            };
            loadController();
            expect($ctrl.pageSize).toEqual(10);
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => q.resolve());
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
                spyOn($ctrl, 'refreshFiltersAndTags').and.callFake(() => q.resolve());
                spyOn($ctrl, 'pageChange').and.callFake(() => q.resolve());
                spyOn(contacts, 'clearSelectedContacts').and.callFake(() => {});
            });

            afterEach(() => {
                $ctrl.$onDestroy();
            });

            it('should fire contacts.load on contactCreated', () => {
                rootScope.$emit('contactCreated');
                rootScope.$digest();
                expect($ctrl.pageChange).toHaveBeenCalledWith();
            });

            it('should fire contacts.load on accountListUpdated', () => {
                rootScope.$emit('accountListUpdated');
                rootScope.$digest();
                expect($ctrl.refreshFiltersAndTags).toHaveBeenCalled();
                expect($ctrl.load).toHaveBeenCalled();
                expect(contacts.clearSelectedContacts).toHaveBeenCalled();
            });

            it('should fire contacts.load on contactsFilterChange', () => {
                rootScope.$emit('contactsFilterChange');
                rootScope.$digest();
                expect($ctrl.pageChange).toHaveBeenCalledWith();
                expect(contacts.clearSelectedContacts).toHaveBeenCalled();
            });

            it('should fire contacts.load on contactsTagsChange', () => {
                rootScope.$emit('contactsTagsChange');
                rootScope.$digest();
                expect($ctrl.pageChange).toHaveBeenCalledWith();
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

            it('should remove contact on contactHidden', () => {
                $ctrl.data = [{ id: 2 }];
                rootScope.$emit('contactHidden', 2);
                expect($ctrl.data).toEqual([]);
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
            spyOn($ctrl, 'watcher9').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
            expect($ctrl.watcher3).toHaveBeenCalledWith();
            expect($ctrl.watcher4).toHaveBeenCalledWith();
            expect($ctrl.watcher5).toHaveBeenCalledWith();
            expect($ctrl.watcher6).toHaveBeenCalledWith();
            expect($ctrl.watcher7).toHaveBeenCalledWith();
            expect($ctrl.watcher8).toHaveBeenCalledWith();
            expect($ctrl.watcher9).toHaveBeenCalledWith();
        });
    });

    describe('hideContact', () => {
        let contact = { id: 1, name: 'a' };
        beforeEach(() => {
            $ctrl.data = [contact];
            spyOn(contacts, 'hideContact').and.callFake(() => q((resolve) => resolve()));
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
            rootScope.$digest();
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
                    selectedContactIds: $ctrl.contacts.selectedContacts,
                    filters: null
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
                    contact: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol'
                    + ',pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,people,'
                    + 'created_at,late_at,primary_person',
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
        let contact = { id: 1, name: 'a', pledge_amount: null, pledge_frequency: null, people: [] };
        let result: any = [contact];
        result.meta = {
            to: 1,
            pagination: { page: 1 }
        };
        beforeEach(() => {
            spyOn(contacts, 'buildFilterParams').and.callFake(() => { return {}; });
            $ctrl.page = 1;
            $ctrl.listLoadCount = 1;
            spyOn(contacts, 'fixPledgeAmountAndFrequencies').and.callFake((data) => map((c) => c, data));
        });

        it('should set the loading flag', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve(result));
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });

        it('should set reset the data on page 1', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve(result));
            $ctrl.load();
            expect($ctrl.data).toEqual(null);
        });

        it('should default to the first page', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve(result));
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith(assign(defaultRequest, {
                data: assign(defaultRequest.data, { page: 1 })
            }));
            scope.$digest();
        });

        it('should request the page of the param', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve(result));
            $ctrl.load(2);
            expect(api.get).toHaveBeenCalledWith(assign(defaultRequest, {
                data: assign(defaultRequest.data, { page: 2 })
            }));
        });

        it('should increment listLoadCount', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve(result));
            const initialCount = angular.copy($ctrl.listLoadCount);
            $ctrl.load();
            expect($ctrl.listLoadCount).toEqual(initialCount + 1);
        });

        it('should build the filter from contacts.buildFilterParams', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve(result));
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith(defaultRequest);
            expect(contacts.buildFilterParams).toHaveBeenCalled();
        });

        it('should unflag loading after load', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve(result));
            $ctrl.load().then(() => {
                expect($ctrl.loading).toBeFalsy();
                done();
            });
            rootScope.$digest();
        });

        it('should set contacts on page 1', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve(result));
            $ctrl.data = [{ id: 2, name: 'b', pledge_amount: null, pledge_frequency: null }];
            $ctrl.load().then(() => {
                expect($ctrl.data).toEqual([contact]);
                done();
            });
            rootScope.$digest();
        });

        it('should return data', (done) => {
            spyOn(api, 'get').and.callFake(() => q.resolve(result));
            $ctrl.load().then((data) => {
                expect(data).toBeDefined();
                done();
            });
            rootScope.$digest();
        });

        xit('should handle late prior results', (done) => {
            let call = 0;
            spyOn(api, 'get').and.callFake(() => {
                if (call === 0) {
                    call++;
                    return q((resolve) => {
                        setTimeout(() => {
                            resolve(result);
                        }, 1000);
                    });
                } else {
                    return q.resolve(result);
                }
            });
            $ctrl.load().then((data) => {
                done();
                expect(data).toBeUndefined();
            });
            rootScope.$digest();
            $ctrl.load();
        });
    });

    describe('load - no results', () => {
        it('should call getTotalCount if no results', (done) => {
            let result: any = [];
            result.meta = {
                to: 0,
                pagination: { page: 1 }
            };
            spyOn(api, 'get').and.callFake(() => q.resolve(result));
            spyOn($ctrl, 'getTotalCount').and.callFake(() => {});
            $ctrl.load().then(() => {
                expect($ctrl.getTotalCount).toHaveBeenCalled();
                done();
            });
            rootScope.$digest();
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
            spyOn($ctrl, 'getCompleteFilteredList').and.callFake(() => q.resolve(data));
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
            rootScope.$digest();
        });
    });

    describe('bulkHideContacts', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
            spyOn(contacts, 'bulkSave').and.callFake(() => q.resolve());
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
            rootScope.$digest();
        });

        it('should hide the contacts from view', (done) => {
            $ctrl.data = [{ id: 1, status: 'Never Ask' }, { id: 1, status: 'Never Ask' }];
            contacts.selectedContacts = [1, 2];
            spyOn(contacts, 'clearSelectedContacts').and.callFake(() => {});
            $ctrl.bulkHideContacts().then(() => {
                expect($ctrl.data).toEqual([]);
                expect(contacts.clearSelectedContacts).toHaveBeenCalledWith();
                done();
            });
            rootScope.$digest();
        });
    });

    describe('getCompleteFilteredList', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve());
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
            spyOn(api, 'get').and.callFake(() => q.resolve({ meta: { pagination: { total_count: 2 } } }));
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
            rootScope.$digest();
        });
    });

    describe('pageSizeChange', () => {
        it('should change pageSize', () => {
            $ctrl.pageSizeChange(50);
            expect($ctrl.pageSize).toEqual(50);
        });

        it('should reload the 1st page', () => {
            spyOn($ctrl, 'load').and.callFake(() => {});
            $ctrl.pageSizeChange(50);
            expect($ctrl.load).toHaveBeenCalledWith(1);
        });
    });

    describe('refreshFiltersAndTags', () => {
        beforeEach(() => {
            spyOn(contactsTags, 'load').and.callFake(() => q.resolve());
            spyOn(contactFilter, 'load').and.callFake(() => q.resolve());
        });

        afterEach(() => {
            rootScope.$apply();
            // $q.all workaround
        });

        it('should refresh tags', () => {
            $ctrl.refreshFiltersAndTags();
            expect(contactsTags.load).toHaveBeenCalledWith();
        });

        it('should refresh filters', () => {
            $ctrl.refreshFiltersAndTags();
            expect(contactFilter.load).toHaveBeenCalledWith();
        });
    });

    describe('pageChange', () => {
        beforeEach(() => {
            spyOn(state, 'go').and.callFake(() => {});
        });

        it('should go to 1st page', () => {
            $ctrl.pageChange();
            expect(state.go).toHaveBeenCalledWith('contacts', { page: 1 }, { reload: false });
        });

        it('should go to nth page', () => {
            $ctrl.pageChange(2);
            expect(state.go).toHaveBeenCalledWith('contacts', { page: 2 }, { reload: false });
        });
    });
});
