import list from './list.component';

describe('contacts.list.component', () => {
    let contacts, contactsTags, rootScope, scope;
    beforeEach(() => {
        angular.mock.module(list);
        inject(($componentController, $rootScope, _contacts_, _contactsTags_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            contacts = _contacts_;
            contactsTags = _contactsTags_;
            $componentController('contactsList', {$scope: scope}, {view: null, selected: null});
        });
    });
    describe('events', () => {
        beforeEach(() => {
            spyOn(contacts, 'load').and.callFake(() => new Promise((resolve) => resolve));
            spyOn(contactsTags, 'load').and.callFake(() => new Promise((resolve) => resolve));
        });
        it('should fire contacts.load on contactCreated', () => {
            rootScope.$emit('contactCreated');
            scope.$digest();
            expect(contacts.load).toHaveBeenCalledWith(true);
        });
        //xit until fix contactTags accountListUpdated to not fire in service
        xit('should fire contacts.load on accountListUpdated', () => {
            rootScope.$emit('accountListUpdated');
            scope.$digest();
            expect(contacts.load).toHaveBeenCalledWith(true);
        });
        it('should fire contacts.load on contactsFilterChange', () => {
            rootScope.$emit('contactsFilterChange');
            scope.$digest();
            expect(contacts.load).toHaveBeenCalledWith(true);
        });
        it('should fire contacts.load on contactsTagsChange', () => {
            rootScope.$emit('contactsTagsChange');
            scope.$digest();
            expect(contacts.load).toHaveBeenCalledWith(true);
        });
    });
});
