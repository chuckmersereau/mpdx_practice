import component from './account.component';

describe('setup.account.component', () => {
    let $ctrl, rootScope, scope, componentController, accounts, setup, users;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _accounts_, _setup_, _users_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = rootScope.$new();
            accounts = _accounts_;
            setup = _setup_;
            users = _users_;
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
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
            $ctrl.$onInit();
            expect(users.listOrganizationAccounts).toHaveBeenCalled();
        });

        describe('accountListUpdated event', () => {
            it('should call listOrganizationAccounts when event accountListUpdated triggered', () => {
                $ctrl.$onInit();
                spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
                rootScope.$emit('accountListUpdated');
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
            });
        });
    });

    describe('next', () => {
        beforeEach(() => {
            spyOn(users, 'saveCurrent').and.callFake(() => Promise.resolve());
            spyOn(accounts, 'swap').and.callFake(() => Promise.resolve());
        });

        it('should call users.saveCurrent', () => {
            $ctrl.next();
            expect(users.saveCurrent).toHaveBeenCalled();
        });

        it('should return promise', () => {
            expect($ctrl.next()).toEqual(jasmine.any(Promise));
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
            });

            it('should call setup.next', (done) => {
                spyOn(setup, 'next');
                $ctrl.next().then(() => {
                    expect(setup.next).toHaveBeenCalled();
                    done();
                });
            });
        });
    });
});
