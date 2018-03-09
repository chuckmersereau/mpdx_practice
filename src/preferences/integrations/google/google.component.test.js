import component from './google.component';

describe('preferences.integrations.google.component', () => {
    let $ctrl, rootScope, scope, componentController, modal, google, gettextCatalog;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _modal_, _google_, _gettextCatalog_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            modal = _modal_;
            gettextCatalog = _gettextCatalog_;
            google = _google_;
            componentController = $componentController;
            loadController();
        });
        spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('googleIntegrationPreferences', { $scope: scope }, {});
    }

    describe('disconnect', () => {
        beforeEach(() => {
            spyOn(google, 'disconnect').and.callFake(() => Promise.resolve());
        });
        it('should call the google service', () => {
            const successMessage = 'MPDX removed your integration with Google.';
            const errorMessage = 'MPDX couldn\'t save your configuration changes for Google.';
            $ctrl.disconnect(123).then(() => {
                expect(google.disconnect).toHaveBeenCalledWith(123, successMessage, errorMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
                expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            });
        });
    });
});