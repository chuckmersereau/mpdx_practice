import component from './contacts.component';

describe('contacts.component', () => {
    let $ctrl, componentController, scope, rootScope, help;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $stateParams, _help_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            help = _help_;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('contacts', { $scope: scope });
    }

    describe('$onInit', () => {
        it('should call help service', () => {
            spyOn(help, 'suggest').and.returnValue();
            $ctrl.$onInit();
            expect(help.suggest).toHaveBeenCalledWith([
                '5845aa229033600698176a54',
                '5841bd789033600698175e62',
                '584715b890336006981774d2',
                '5845aab3c6979106d373a576',
                '58471fd6903360069817752e',
                '5845ac509033600698176a62',
                '5845abb0c6979106d373a57b',
                '5845984f90336006981769a1',
                '584597e6903360069817699d',
                '5845af809033600698176a8c',
                '5845acfcc6979106d373a580',
                '5845ad8c9033600698176a6e'
            ]);
        });

        it('should set selected', () => {
            $ctrl.$stateParams.contactId = '1234';
            $ctrl.$onInit();
            expect($ctrl.selected).toEqual('1234');
        });

        it('should set session.navSecondary', () => {
            $ctrl.$onInit();
            expect($ctrl.session.navSecondary).toBeTruthy();
        });
    });

    describe('$onDestroy', () => {
        it('should set session.navSecondary', () => {
            $ctrl.$onDestroy();
            expect($ctrl.session.navSecondary).toBeFalsy();
        });
    });
});
