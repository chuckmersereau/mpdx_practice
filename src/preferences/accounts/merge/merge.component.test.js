import component from './merge.component';

describe('preferences.accounts.merge.component', () => {
    let $ctrl, accounts, api, rootScope, scope, componentController, gettextCatalog, users;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _api_, _gettextCatalog_, _users_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            api = _api_;
            users = _users_;
            gettextCatalog = _gettextCatalog_;
            componentController = $componentController;
            loadController();
        });
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    function loadController() {
        $ctrl = componentController('mergePreferences', { $scope: scope }, { onSave: () => Promise.resolve() });
    }
    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.saving).toBeFalsy();
            expect($ctrl.selected_account_id).toEqual(null);
        });
    });
    describe('merge', () => {
        beforeEach(() => {
            $ctrl.selected_account_id = 123;
            users.current = { account_lists: [{ id: 123 }, { id: 234 }] };
            accounts.data = [{ id: 123 }, { id: 234 }];
            api.account_list_id = 234;
            spyOn($ctrl, 'onSave').and.callFake(() => {});
        });
        it('should set saving flag', () => {
            $ctrl.merge();
            expect($ctrl.saving).toBeTruthy();
        });
        it('should merge and account', () => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            const successMessage = 'MPDX merged your account successfully';
            const errorMessage = 'MPDX couldn\'t merge your account';
            $ctrl.merge();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(api.post).toHaveBeenCalledWith(
                `account_lists/${api.account_list_id}/merge`,
                { account_list_to_merge: { id: 123 } },
                successMessage,
                errorMessage
            );
        });
        it('should unset saving flag', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.merge().then(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
        it('should remove the merged account', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            $ctrl.merge().then(() => {
                expect(users.current.account_lists).toEqual([{ id: 234 }]);
                done();
            });
        });
        it('should update the current account list', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve({ id: 234, name: 'a' }));
            $ctrl.merge().then(() => {
                expect(accounts.data[1].name).toEqual('a');
                done();
            });
        });
        it('should call onSave', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve({ id: 234, name: 'a' }));
            $ctrl.merge().then(() => {
                expect(accounts.data[1].name).toEqual('a');
                done();
            });
        });
        it('should handle rejection', (done) => {
            spyOn(api, 'post').and.callFake(() => Promise.reject(Error('')));
            $ctrl.merge().catch(() => {
                expect($ctrl.saving).toBeFalsy();
                done();
            });
        });
    });
});