import component from './details.component';

describe('contacts.show.details.component', () => {
    let $ctrl, scope, api, serverConstants;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _contacts_, _tasks_, _serverConstants_, _gettextCatalog_, _api_) => {
            scope = $rootScope.$new();
            api = _api_;
            serverConstants = _serverConstants_;
            serverConstants.data = {locales: {}};
            window.languageMappingList = [];
            api.account_list_id = 1234;
            $ctrl = $componentController('contactDetails', {$scope: scope}, {donorAccounts: [], contact: {contacts_that_referred_me: {id: 1}}, onSave: () => Promise.resolve()});
        });
    });
    xdescribe('$onChanges', () => {
        beforeEach(() => {
            spyOn($ctrl, 'getName').and.callFake(() => Promise.resolve({name: 'a'}));
        });
        it('will get the first referrer', () => {
            $ctrl.$onChanges();
            expect($ctrl.referrer).toEqual(1);
            expect($ctrl.getName).toHaveBeenCalledWith($ctrl.referrer);
        });
    });
    describe('getName', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
        });
        it('should query api for a name by id', () => {
            $ctrl.getName(1);
            expect(api.get).toHaveBeenCalledWith(`contacts/1`, {
                fields: { contacts: 'name' }
            });
        });
    });
});
