import component from './google.component';

describe('preferences.integrations.google.component', () => {
    let $ctrl, rootScope, scope, modal, google, gettextCatalog, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _modal_, _google_, _gettextCatalog_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            modal = _modal_;
            gettextCatalog = _gettextCatalog_;
            google = _google_;
            q = $q;
            $ctrl = $componentController('googleIntegrationPreferences', { $scope: scope }, {});
        });
        spyOn(modal, 'confirm').and.callFake(() => q.resolve());
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    describe('disconnect', () => {
        beforeEach(() => {
            spyOn(google, 'disconnect').and.callFake(() => q.resolve());
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