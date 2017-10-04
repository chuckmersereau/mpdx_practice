import component from './care.component';

describe('home.care.component', () => {
    let $ctrl, rootScope, scope, componentController, modal;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _modal_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            modal = _modal_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('homeCare', { $scope: scope }, {});
    }

    describe('addNewsletter', () => {
        it('should open the add newsletter modal', () => {
            spyOn(modal, 'open').and.callFake(() => Promise.resolve());
            spyOn(rootScope, '$emit').and.callFake(() => {});
            $ctrl.addNewsletter();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../../tasks/modals/newsletter/newsletter.html'),
                controller: 'newsletterTaskController'
            });
        });
    });
});