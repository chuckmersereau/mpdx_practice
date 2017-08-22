import component from './info.component';

describe('contacts.show.details.component', () => {
    let $ctrl, scope, serverConstants, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _serverConstants_, _gettextCatalog_) => {
            scope = $rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            serverConstants = _serverConstants_;
            serverConstants.data = { locales: {} };
            $ctrl = $componentController('contactInfo', { $scope: scope }, { contact: {}, onSave: () => Promise.resolve() });
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });
    describe('$onInit', () => {
        it('should setup translation object', () => {
            $ctrl.$onInit();
            expect($ctrl.translations).toEqual({
                pledge_received: [
                    { key: true, value: 'Yes' },
                    { key: false, value: 'No' }
                ]
            });
            expect(gettextCatalog.getString.calls.count()).toEqual(2);
        });
    });
});
