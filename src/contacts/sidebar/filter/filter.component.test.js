import component from './filter.component';
import { assign } from 'lodash/fp';

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
    let $ctrl, rootScope, scope, componentController, users, contactFilter, modal, contactsTags;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _users_, _contactFilter_, _modal_, _contactsTags_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            contactsTags = _contactsTags_;
            modal = _modal_;
            users = _users_;
            contactFilter = _contactFilter_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('contactsFilter', { $scope: scope }, {});
    }
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
            expect(contactFilter.wildcard_search).toEqual(obj.wildcard_search);
        });
        it('should set any_tags', () => {
            $ctrl.useSavedFilter(name);
            expect(contactsTags.any_tags).toBeTruthy();
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
            spyOn(modal, 'open').and.callFake(() => Promise.resolve());
            $ctrl.openSaveModal();
            expect(modal.open).toHaveBeenCalledWith({
                controller: 'saveFilterModal',
                template: require('../../../common/filters/save/save.html'),
                locals: {
                    anyTags: contactsTags.any_tags,
                    filterType: 'contacts',
                    params: contactFilter.params,
                    rejectedTags: contactsTags.rejectedTags,
                    selectedTags: contactsTags.selectedTags,
                    wildcardSearch: contactFilter.wildcard_search
                }
            });
        });
    });
});