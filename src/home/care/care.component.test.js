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
    describe('exportPhysical', () => {
        it('should open the exportEmail modal', () => {
            spyOn(modal, 'open').and.callFake(() => Promise.resolve());
            spyOn(rootScope, '$emit').and.callFake(() => {});
            $ctrl.exportPhysical();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('../../contacts/list/exportContacts/exportContacts.html'),
                controller: 'exportContactsController',
                locals: {
                    selectedContactIds: [],
                    filter: {
                        account_list_id: null,
                        newsletter: 'address',
                        status: 'active'
                    }
                }
            });
        });
    });
    describe('exportEmail', () => {
        it('should open the exportPhysical modal', () => {
            spyOn(modal, 'open').and.callFake(() => Promise.resolve());
            spyOn(rootScope, '$emit').and.callFake(() => {});
            $ctrl.exportEmail();
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./newsletters/export/export.html'),
                controller: 'exportContactEmailsController'
            });
        });
    });
});