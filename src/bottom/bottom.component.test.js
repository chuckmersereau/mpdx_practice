import bottom from './bottom.component';
import { HelpMock } from 'common/help/help.service';

describe('bottom.component', () => {
    let $ctrl, scope, componentController, help;
    beforeEach(() => {
        angular.mock.module(HelpMock);
        angular.mock.module(bottom);
        inject(($componentController, $rootScope, _help_) => {
            scope = $rootScope.$new();
            help = _help_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('bottom', { $scope: scope }, { });
    }
    describe('constructor', () => {
        it('should set the year', () => {
            expect($ctrl.year).toEqual(new Date().getFullYear());
        });
    });
    describe('showHelp', () => {
        it('should show help', () => {
            spyOn(help, 'showHelp').and.callFake(() => {});
            $ctrl.showHelp();
            expect(help.showHelp).toHaveBeenCalledWith();
        });
    });
});