import component from './item.component';

describe('coaches.list.item', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);

        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('coachesListItem', { $scope: scope }, { account: { id: 'account_list_id' } });
        });
    });

    describe('constructor', () => {
        it('should set account binding', () => {
            expect($ctrl.account).toEqual({ id: 'account_list_id' });
        });
    });
});
