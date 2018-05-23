import success from './success.controller';

describe('tools.import.tnt.success.controller', () => {
    let $ctrl, scope, state;

    beforeEach(() => {
        angular.mock.module(success);
        inject(($controller, $rootScope, $state) => {
            scope = $rootScope.$new();
            scope.$hide = () => {};
            state = $state;
            $ctrl = $controller('importTntSuccessController as $ctrl', {
                $scope: scope,
                $state: state
            });
        });
    });

    describe('setup', () => {
        beforeEach(() => {
            spyOn(state, 'go').and.callFake(() => {});
            spyOn(scope, '$hide').and.callFake(() => {});
            $ctrl.setup();
        });

        it('should call state', () => {
            expect(state.go).toHaveBeenCalledWith('tools', { setup: true });
        });

        it('should call state', () => {
            expect(scope.$hide).toHaveBeenCalled();
        });
    });

    describe('done', () => {
        beforeEach(() => {
            spyOn(state, 'go').and.callFake(() => {});
            spyOn(scope, '$hide').and.callFake(() => {});
            $ctrl.done();
        });

        it('should call state', () => {
            expect(state.go).toHaveBeenCalledWith('home');
        });

        it('should call state', () => {
            expect(scope.$hide).toHaveBeenCalled();
        });
    });
});