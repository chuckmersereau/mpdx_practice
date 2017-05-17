import component from './mergeContacts.component';

describe('tools.mergeContacts.component', () => {
    let $ctrl, rootScope, scope, mergeContacts, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _mergeContacts_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            mergeContacts = _mergeContacts_;
            componentController = $componentController;
            $ctrl = componentController('mergeContacts', {$scope: scope}, {});
        });
    });
    describe('events', () => {
        beforeEach(() => {
            spyOn(mergeContacts, 'load').and.callFake(() => Promise.resolve({}));
        });
        it('will reload on accountListUpdated', () => {
            rootScope.$emit('accountListUpdated');
            expect(mergeContacts.load).toHaveBeenCalledWith(true);
        });
    });
});
