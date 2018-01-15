import service from './filter.service';

const accountListId = 123;

describe('contacts.sidebar.filter.service', () => {
    let api, contactFilter, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _filters_, _contactFilter_) => {
            rootScope = $rootScope;
            api = _api_;
            contactFilter = _contactFilter_;
            api.account_list_id = accountListId;
        });
    });
    describe('reset', () => {
        it('should reset wildcard search', () => {
            contactFilter.wildcard_search = 'abc';
            contactFilter.reset();
            expect(contactFilter.wildcard_search).toEqual('');
        });
    });
    describe('isResettable', () => {
        beforeEach(() => {
            contactFilter.wildcard_search = '';
        });
        it('shouldn\'t be resettable if default conditions are met', () => { // incomplete test
            expect(contactFilter.isResettable()).toBeFalsy();
        });
        it('should be resettable if wildcard isn\'t empty', () => {
            contactFilter.wildcard_search = 'abc';
            expect(contactFilter.isResettable()).toBeTruthy();
        });
    });
    describe('invertMultiselect', () => {
        const params = {
            'a': ''
        };
        const filter = {
            name: 'a'
        };
        beforeEach(() => {
            contactFilter.params = params;
            spyOn(contactFilter, 'change').and.callFake(() => {});
        });
        it('should set reverse param', () => {
            contactFilter.invertMultiselect(filter);
            expect(contactFilter.params.reverse_a).toBeTruthy();
            contactFilter.invertMultiselect(filter);
            expect(contactFilter.params.reverse_a).toBeUndefined();
        });
        it('should set filter.reverse', () => {
            contactFilter.invertMultiselect(filter);
            expect(filter.reverse).toBeTruthy();
            contactFilter.invertMultiselect(filter);
            expect(filter.reverse).toBeFalsy();
        });
        it('should call change', () => {
            contactFilter.invertMultiselect(filter);
            expect(contactFilter.change).toHaveBeenCalledWith();
        });
    });
    describe('removeFilter', () => {
        const params = {
            'a': 'a',
            'reverse_a': true
        };
        const defaultParams = {
            'a': ''
        };
        const filter = { name: 'a' };
        beforeEach(() => {
            contactFilter.params = params;
            contactFilter.default_params = defaultParams;
            spyOn(contactFilter, 'change').and.callFake(() => {});
        });
        it('should remove the filter from params', () => {
            contactFilter.removeFilter(filter);
            expect(contactFilter.params.a).toEqual('');
        });
        it('should remove the reverse filter from params', () => {
            contactFilter.removeFilter(filter);
            expect(contactFilter.params.reverse_a).toBeUndefined();
        });
        it('should set filter.reverse to false', () => {
            contactFilter.removeFilter(filter);
            expect(filter.reverse).toBeFalsy();
        });
    });
    describe('change', () => {
        beforeEach(() => {
            spyOn(contactFilter, 'handleFilterChange').and.callFake(() => {});
        });
        it('should call handleFilterChange', () => {
            contactFilter.change('a');
            expect(contactFilter.handleFilterChange).toHaveBeenCalledWith('a');
        });
        it('should broadcast the change globally', (done) => {
            rootScope.$on('contactsFilterChange', () => {
                done();
            });
            contactFilter.change('a');
        });
    });
    describe('handleFilterChange', () => {
        const params = {
            activity: ['']
        };
        const filter = { name: 'activity' };
        beforeEach(() => {
            contactFilter.params = params;
            contactFilter.default_params = params;
        });
        it('should handle undefined', () => {
            contactFilter.handleFilterChange();
            expect(contactFilter.params).toEqual(params);
        });
        it('should compact arrays with values', () => {
            contactFilter.params.activity.push('a');
            contactFilter.handleFilterChange(filter);
            expect(contactFilter.params.activity).toEqual(['a']);
        });
        it('should default arrays without values', () => {
            contactFilter.params.activity = [];
            contactFilter.handleFilterChange(filter);
            expect(contactFilter.params.activity).toEqual(params.activity);
        });
    });
});