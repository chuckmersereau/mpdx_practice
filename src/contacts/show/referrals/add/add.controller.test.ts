import add from './add.controller';

describe('contacts.show.referrals.add.controller', () => {
    let $ctrl, scope;
    beforeEach(() => {
        angular.mock.module(add);
        inject(($controller, $rootScope) => {
            scope = $rootScope.$new();
            $ctrl = $controller('addReferralsModalController as $ctrl', {
                $scope: scope
            });
        });
    });

    xit('should do something', () => {
        expect($ctrl).toEqual(1);
    });
});