import component from './show.component';

describe('coaches.show', () => {
    let $ctrl, api, rootScope, scope, stateParams, q;

    beforeEach(() => {
        angular.mock.module(component);

        inject((
            $componentController, $rootScope, $q,
            $stateParams,
            _api_
        ) => {
            stateParams = $stateParams;
            api = _api_;
            rootScope = $rootScope;
            q = $q;
            scope = rootScope.$new();
            $ctrl = $componentController('coachesShow', { $scope: scope });
        });
    });

    describe('constructor', () => {
        it('should set values', () => {
            expect($ctrl.loading).toEqual(false);
        });
    });

    describe('$onInit', () => {
        it('should call load', () => {
            spyOn($ctrl, 'load').and.callFake(() => {});
            $ctrl.$onInit();
            expect($ctrl.load).toHaveBeenCalled();
        });
    });

    describe('load', () => {
        beforeEach(() => {
            stateParams.accountId = 'account_list_id';
            spyOn(api, 'get').and.callFake(() => q.resolve({ id: 'account_list_id' }));
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call api.get', () => {
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith({
                url: 'coaching/account_lists/account_list_id',
                data: {
                    include: 'users,users.email_addresses,users.phone_numbers,users.facebook_accounts,users.linkedin_accounts,users.twitter_accounts',
                    fields: {
                        users: 'title,first_name,last_name,suffix,avatar,email_addresses,phone_numbers,employer,occupation,marital_status'
                    }
                },
                type: 'account_lists'
            });
        });

        it('should return a promise', () => {
            expect($ctrl.load()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
                rootScope.$digest();
            });

            it('should set account to data', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.account).toEqual({ id: 'account_list_id' });
                    done();
                });
                rootScope.$digest();
            });
        });
    });
});
