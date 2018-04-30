import component from './phone.component';

describe('contacts.show.personModal.phone.component', () => {
    let $ctrl, scope, componentController;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            scope = $rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('contactPhone', { $scope: scope }, { phone: {} });
    }

    describe('constructor', () => {
        it('should have default values', () => {
            expect($ctrl.deleted).toEqual(false);
        });
    });

    describe('$onInit', () => {
        describe('phone location set', () => {
            it('should set phone location to lowercase', () => {
                $ctrl.phone = { location: 'Test' };
                $ctrl.$onInit();
                expect($ctrl.phone.location).toEqual('test');
            });
        });

        describe('phone location not set', () => {
            it('should set phone location to other', () => {
                $ctrl.$onInit();
                expect($ctrl.phone.location).toEqual('other');
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
