import component from './email.component';

describe('contacts.show.personModal.email.component', () => {
    let $ctrl, scope, componentController;

    function loadController() {
        $ctrl = componentController('contactEmailAddress', { $scope: scope }, { email: {} });
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            scope = $rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    describe('constructor', () => {
        it('should have default values', () => {
            expect($ctrl.deleted).toEqual(false);
        });
    });

    describe('$onInit', () => {
        describe('email location set', () => {
            it('should set email location to lowercase', () => {
                $ctrl.email = { location: 'Test' };
                $ctrl.$onInit();
                expect($ctrl.email.location).toEqual('test');
            });
        });

        describe('email location not set', () => {
            it('should set email location to other', () => {
                $ctrl.$onInit();
                expect($ctrl.email.location).toEqual('other');
            });
        });
    });

    describe('remove', () => {
        it('should set deleted to true', () => {
            $ctrl.remove();
            expect($ctrl.deleted).toEqual(true);
        });

        it('should call onRemove', () => {
            $ctrl.onRemove = () => true;
            spyOn($ctrl, 'onRemove').and.callFake(() => {});
            $ctrl.remove();
            expect($ctrl.onRemove).toHaveBeenCalled();
        });
    });
});
