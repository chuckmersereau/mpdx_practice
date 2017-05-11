import component from './search.component';

const wildcardSearch = 'asdf';

describe('contacts.list.search', () => {
    let $ctrl, contacts, contactFilter, rootScope, scope;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _contactFilter_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            contacts = _contacts_;
            contactFilter = _contactFilter_;
            contactFilter.wildcard_search = wildcardSearch;
            $ctrl = $componentController('contactsListSearch', {$scope: scope}, {view: null, selected: null});
        });
    });
    describe('constructor', () => {
        it('should start with an empty search string', () => {
            expect($ctrl.searchParams).toEqual('');
        });
    });
    describe('events', () => {
        it('should set search to empty on contactSearchReset', () => {
            rootScope.$emit('contactSearchReset');
            rootScope.$digest();
            expect($ctrl.searchParams).toEqual('');
        });
    });
    describe('$onInit', () => {
        it('should set search to contact filter wildcard search', () => {
            $ctrl.$onInit();
            expect($ctrl.searchParams).toEqual(wildcardSearch);
        });
    });
    describe('search text changed', () => {
        beforeEach(() => {
            spyOn(contactFilter, 'change').and.callFake(() => {});
        });
        it('should change contact filter', () => {
            const search = 'fdsa';
            $ctrl.searchParams = search;
            $ctrl.paramChanged();
            expect(contactFilter.wildcard_search).toEqual(search);
            expect(contactFilter.change).toHaveBeenCalled();
        });
    });
});