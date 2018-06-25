import { assign } from 'lodash/fp';
import component from './filter.component';

const accountListId = 123;
const name = 'my_filter';
const key = `saved_contacts_filter_${name}`;
const obj = {
    account_list_id: accountListId,
    any_tags: true,
    exclude_tags: 'home,alone',
    params: {
        activity_type: 'Call'
    },
    tags: 'fun,tonight',
    wildcard_search: 'a'
};
const options = {
    [key]: { key: key, title: key, value: JSON.stringify(obj) }
};

describe('contacts.filter.component', () => {
    let $ctrl, rootScope, scope, users, contactFilter, modal, contactsTags, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _users_, _contactFilter_, _modal_, _contactsTags_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            contactsTags = _contactsTags_;
            modal = _modal_;
            users = _users_;
            contactFilter = _contactFilter_;
            q = $q;
            $ctrl = $componentController('contactsFilter', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.activeFilters).toEqual([]);
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(users, 'getCurrentOptionValue').and.callFake(() => true);
            spyOn(users, 'saveOption').and.callFake(() => q.resolve());
        });

        afterEach(() => {
            $ctrl.$onDestroy();
        });

        it('should set isCollapsed', () => {
            $ctrl.$onInit();
            expect($ctrl.isCollapsed).toBeTruthy();
        });

        it('should handle isCollapsed changing', () => {
            $ctrl.$onInit();
            $ctrl.isCollapsed = false;
            rootScope.$digest();
            expect(users.saveOption).toHaveBeenCalledWith('contact_filters_collapse', false);
        });
    });

    describe('$onDestroy', () => {
        it('should clear watchers', () => {
            $ctrl.$onInit();
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
        });
    });

    describe('useSavedFilter', () => {
        beforeEach(() => {
            users.currentOptions = options;
            spyOn(contactFilter, 'change').and.callFake(() => {});
        });

        it('should set filter params over defaults', () => {
            $ctrl.useSavedFilter(name);
            expect(contactFilter.params).toEqual(assign(contactFilter.default_params, obj.params));
        });

        it('should set wildcard search', () => {
            $ctrl.useSavedFilter(name);
            expect(contactFilter.wildcardSearch).toEqual(obj.wildcard_search);
        });

        it('should set anyTags', () => {
            $ctrl.useSavedFilter(name);
            expect(contactsTags.anyTags).toBeTruthy();
        });

        it('should set rejectedTags', () => {
            $ctrl.useSavedFilter(name);
            expect(contactsTags.rejectedTags).toEqual([{ name: 'home' }, { name: 'alone' }]);
        });

        it('should set selectedTags', () => {
            $ctrl.useSavedFilter(name);
            expect(contactsTags.selectedTags).toEqual([{ name: 'fun' }, { name: 'tonight' }]);
        });

        it('should trigger filter change', () => {
            $ctrl.useSavedFilter(name);
            expect(contactFilter.change).toHaveBeenCalledWith();
        });

        it('should set selectedSave', () => {
            $ctrl.useSavedFilter(name);
            expect(contactFilter.selectedSave).toEqual(name);
        });
    });

    describe('openSaveModal', () => {
        it('should open the save modal', () => {
            spyOn(modal, 'open').and.callFake(() => q.resolve());
            $ctrl.openSaveModal();
            expect(modal.open).toHaveBeenCalledWith({
                controller: 'saveFilterModal',
                template: require('../../../common/filters/save/save.html'),
                locals: {
                    anyTags: contactsTags.anyTags,
                    filterType: 'contacts',
                    params: contactFilter.params,
                    rejectedTags: contactsTags.rejectedTags,
                    selectedTags: contactsTags.selectedTags,
                    wildcardSearch: contactFilter.wildcardSearch
                }
            });
        });
    });
});
