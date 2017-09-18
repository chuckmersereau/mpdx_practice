import component from './contacts.component';

describe('home.progress.contacts.component', () => {
    let $ctrl, rootScope, scope, componentController;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('progressContacts', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should define view objects', () => {
            expect($ctrl.accounts).toBeDefined();
        });
    });
});