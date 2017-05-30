import component from './list.component';

const contactId = 123;

describe('contacts.sidebar.list.component', () => {
    let $ctrl, state, rootScope, scope, api;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $stateParams, $state, _api_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            api = _api_;
            state = $state;
            $stateParams.contactId = contactId;
            $ctrl = $componentController('contactsSidebarList', {$scope: scope}, {});
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
        const oneRecord = [{id: 1, name: 'a'}];
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => new Promise(resolve => resolve(oneRecord)));
            $ctrl.listLoadCount = 1;
        });
        describe('existing data', () => {
            beforeEach(() => {
                $ctrl.data = oneRecord;
            });
            it('should do nothing if not resetting or getting a new page', () => {
                expect($ctrl.load()).toEqual(undefined);
            });
            xit('should reset variables on reset', (done) => {
                $ctrl.load(true, 1).then(() => {
                    expect($ctrl.page).toEqual(1);
                    expect($ctrl.meta).toEqual({});
                    expect($ctrl.listLoadCount).toEqual(2);
                    done();
                });
            });
        });
    });
    describe('events', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => {});
        });
        it('should load on accountListUpdated', () => {
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect($ctrl.load).toHaveBeenCalledWith(true);
        });
        it('should load on contactsFilterChange', () => {
            rootScope.$emit('contactsFilterChange');
            rootScope.$digest();
            expect($ctrl.load).toHaveBeenCalledWith(true);
        });
    });
    describe('$onInit', () => {
        let spy;
        beforeEach(() => {
            spy = spyOn(angular, 'element').and.callFake(() => {});
        });
        afterEach(() => {
            spy.and.callThrough();
        });
        it('should initialize post-binding default values', () => {
            $ctrl.$onInit();
            expect($ctrl.listLoadCount).toEqual(0);
            expect($ctrl.selected).toEqual(contactId);
            expect(angular.element).toHaveBeenCalledWith('#sidebarScrollParent');
        });
    });
    describe('switchContact', () => {
        beforeEach(() => {
            spyOn(state, 'go');
        });
        it('should switch selected contact', () => {
            const id = 234;
            $ctrl.switchContact(id);
            expect($ctrl.selected).toEqual(id);
            expect(state.go).toHaveBeenCalledWith('contacts.show', {contactId: id});
        });
    });
    describe('loadMoreContacts', () => {
        beforeEach(() => {
            $ctrl.loading = false;
            $ctrl.page = 0;
            $ctrl.meta = {pagination: {total_pages: 4}};
            spyOn($ctrl, 'load').and.callFake(() => {});
        });
        it('should load the next page by default', () => {
            $ctrl.loadMoreContacts();
            expect($ctrl.load).toHaveBeenCalledWith(false, $ctrl.page + 1);
        });
        it(`shouldn't run if loading`, () => {
            $ctrl.loading = true;
            $ctrl.loadMoreContacts();
            expect($ctrl.load).not.toHaveBeenCalled();
        });
        it(`shouldn't run if on last page`, () => {
            $ctrl.page = 4;
            $ctrl.loadMoreContacts();
            expect($ctrl.load).not.toHaveBeenCalled();
        });
    });
});