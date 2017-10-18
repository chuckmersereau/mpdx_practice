import component from './recommendation.component';

describe('contacts.show.recommendation.component', () => {
    let $ctrl, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);

        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController(
                'contactRecommendation',
                { $scope: scope },
                { recommendation: { id: 'recommendation_id' } }
            );
        });
    });

    describe('constructor', () => {
        it('should set recommendation binding', () => {
            expect($ctrl.recommendation).toEqual({ id: 'recommendation_id' });
        });
    });
});
