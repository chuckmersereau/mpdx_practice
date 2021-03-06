import * as moment from 'moment';
import component from './list.component';

const contactId = 123;

describe('contacts.sidebar.list.component', () => {
    let $ctrl, state, rootScope, scope, api, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $stateParams, $state, _api_, $q) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            api = _api_;
            state = $state;
            q = $q;
            $stateParams.contactId = contactId;
            $ctrl = $componentController('contactsSidebarList', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.data).toEqual([]);
            expect($ctrl.loading).toEqual(false);
            expect($ctrl.page).toEqual(0);
        });
    });

    describe('load', () => {
        const oneRecord = [{ id: 1, name: 'a' }];
        beforeEach(() => {
            $ctrl.data = oneRecord;
            $ctrl.listLoadCount = 1;
        });

        it('should reset variables on reset', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve(oneRecord));
            $ctrl.load();
            expect($ctrl.page).toEqual(1);
            expect($ctrl.meta).toEqual({});
            expect($ctrl.data).toEqual([]);
            expect($ctrl.listLoadCount).toEqual(2);
        });

        it('should do nothing if not resetting or getting a new page', () => {
            spyOn(api, 'get').and.callFake(() => q.resolve(oneRecord));
            $ctrl.load(2);
            expect($ctrl.load(2)).toEqual(undefined);
        });

        xit('should handle late prior results', (done) => {
            let call = 0;
            spyOn(api, 'get').and.callFake(() => {
                if (call === 0) {
                    call++;
                    let promise = q.defer();
                    setTimeout(() => {
                        promise.resolve(oneRecord);
                    }, 1000);
                    return promise.promise;
                } else {
                    return q.resolve(oneRecord);
                }
            });
            $ctrl.load().then((data) => {
                done();
                expect(data).toBeUndefined();
            });
            rootScope.$digest();
            $ctrl.load();
            rootScope.$digest();
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => {});
        });

        afterEach(() => {
            $ctrl.$onDestroy();
        });

        it('should initialize post-binding default values', () => {
            $ctrl.$onInit();
            expect($ctrl.listLoadCount).toEqual(0);
            expect($ctrl.selected).toEqual(contactId);
        });

        it('should load on accountListUpdated', () => {
            $ctrl.$onInit();
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect($ctrl.load).toHaveBeenCalledWith();
        });

        it('should load on contactsFilterChange', () => {
            $ctrl.$onInit();
            rootScope.$emit('contactsFilterChange');
            rootScope.$digest();
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });

    describe('switchContact', () => {
        beforeEach(() => {
            spyOn(state, 'go');
        });

        it('should switch selected contact', () => {
            const id = 234;
            state.$current.name = 'contacts.show';
            $ctrl.switchContact(id);
            expect($ctrl.selected).toEqual(id);
            expect(state.go).toHaveBeenCalledWith('contacts.show', { contactId: id });
        });
    });

    describe('loadMoreContacts', () => {
        beforeEach(() => {
            $ctrl.loading = false;
            $ctrl.page = 0;
            $ctrl.meta = { pagination: { total_pages: 4 } };
            spyOn($ctrl, 'load').and.callFake(() => {});
        });

        it('should load the next page by default', () => {
            $ctrl.loadMoreContacts();
            expect($ctrl.load).toHaveBeenCalledWith($ctrl.page + 1);
        });

        it('shouldn\'t run if loading', () => {
            $ctrl.loading = true;
            $ctrl.loadMoreContacts();
            expect($ctrl.load).not.toHaveBeenCalled();
        });

        it('shouldn\'t run if on last page', () => {
            $ctrl.page = 4;
            $ctrl.loadMoreContacts();
            expect($ctrl.load).not.toHaveBeenCalled();
        });
    });

    describe('search', () => {
        it('should fire load', () => {
            spyOn($ctrl, 'load').and.callFake(() => {});
            $ctrl.search();
            expect($ctrl.load).toHaveBeenCalledWith();
        });
    });

    describe('daysLate', () => {
        describe('contact late_at 60 days ago', () => {
            it('should return 60', () => {
                expect($ctrl.daysLate({ late_at: moment().subtract(60, 'days').format('YYYY-MM-DD') })).toEqual(60);
            });
        });

        describe('contact late_at null', () => {
            beforeEach(() => {
                $ctrl.contact = { late_at: null };
            });

            it('should return 0', () => {
                expect($ctrl.daysLate({ late_at: null })).toEqual(0);
            });
        });

        describe('contact late_at not set', () => {
            it('should return 0', () => {
                expect($ctrl.daysLate({})).toEqual(0);
            });
        });
    });

    describe('$onDestroy', () => {
        it('should destroy watchers', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
        });
    });
});
