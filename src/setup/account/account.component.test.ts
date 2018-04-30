import component from './account.component';

describe('setup.account.component', () => {
    let $ctrl, rootScope, scope, componentController, accounts, setup, users, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _setup_, _users_, $q) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            setup = _setup_;
            users = _users_;
            q = $q;
            users.current = { preferences: {} };
            users.currentOptions = { setup_position: {} };
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('setupAccount', { $scope: scope }, {});
    }

    describe('$onInit', () => {
        it('should call listOrganizationAccounts', () => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
            $ctrl.$onInit();
            expect(users.listOrganizationAccounts).toHaveBeenCalled();
        });

        describe('accountListUpdated event', () => {
            it('should call listOrganizationAccounts when event accountListUpdated triggered', () => {
                $ctrl.$onInit();
                spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
                rootScope.$emit('accountListUpdated');
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
            });
        });
    });

    describe('next', () => {
        beforeEach(() => {
            spyOn(users, 'saveCurrent').and.callFake(() => q.resolve());
            spyOn(accounts, 'swap').and.callFake(() => q.resolve());
            spyOn(setup, 'next').and.callFake(() => {});
        });

        it('should call users.saveCurrent', () => {
            $ctrl.next();
            expect(users.saveCurrent).toHaveBeenCalled();
        });

        it('should return promise', () => {
            expect($ctrl.next()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should call accounts.swap', (done) => {
                users.current = {
                    id: 'user_id',
                    preferences: { default_account_list: 'account_list_id' }
                };
                $ctrl.next().then(() => {
                    expect(accounts.swap).toHaveBeenCalledWith('account_list_id', 'user_id', true);
                    done();
                });
                scope.$digest();
            });

            it('should call setup.next', (done) => {
                $ctrl.next().then(() => {
                    expect(setup.next).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });
        });
    });
});
