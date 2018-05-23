import component from './list.component';

describe('coaches.list', () => {
    let $ctrl, api, rootScope, scope, q;

    beforeEach(() => {
        angular.mock.module(component);

        inject((
            $componentController, $rootScope, $q,
            _api_
        ) => {
            api = _api_;
            rootScope = $rootScope;
            q = $q;
            scope = rootScope.$new();
            $ctrl = $componentController('coachesList', { $scope: scope });
        });
    });

    describe('constructor', () => {
        it('should set values', () => {
            expect($ctrl.loading).toEqual(false);
            expect($ctrl.data).toEqual([]);
            expect($ctrl.meta).toEqual({});
            expect($ctrl.listLoadCount).toEqual(0);
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
        let data;

        beforeEach(() => {
            data = [{
                id: 'account_list_id_1'
            }];

            data.meta = {
                pagination: {
                    page: 1
                }
            };

            spyOn(api, 'get').and.callFake(() => q.resolve(data));
            spyOn($ctrl, 'reset').and.callFake(() => {});
            spyOn($ctrl, 'setData').and.callFake(() => {});
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call reset', () => {
            $ctrl.load();
            expect($ctrl.reset).toHaveBeenCalled();
        });

        it('should call api.get', () => {
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith({
                url: 'coaching/account_lists',
                data: {
                    page: 1,
                    per_page: 10,
                    include: 'users',
                    fields: {
                        users: 'first_name,last_name,avatar'
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

            it('should call setData', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.setData).toHaveBeenCalledWith(data, 0);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('reset', () => {
        it('should set meta to {}', () => {
            $ctrl.meta = { page: 1 };
            $ctrl.reset();
            expect($ctrl.meta).toEqual({});
        });

        it('should set data to []', () => {
            $ctrl.data = [{ id: 1 }];
            $ctrl.reset();
            expect($ctrl.data).toEqual([]);
        });

        it('should set listLoadCount', () => {
            $ctrl.listLoadCount = 1;
            $ctrl.reset();
            expect($ctrl.listLoadCount).toEqual(2);
        });
    });

    describe('setData', () => {
        let data;

        beforeEach(() => {
            data = [{
                id: 'account_list_id_1'
            }];

            data.meta = {
                pagination: {
                    page: 1
                }
            };
        });

        it('should set $ctrl.data to data', () => {
            $ctrl.setData(data, 0);
            expect($ctrl.data).toEqual(data);
        });

        it('should set $ctrl.meta to data.meta', () => {
            $ctrl.setData(data, 0);
            expect($ctrl.meta).toEqual(data.meta);
        });

        describe('currentCount !== listLoadCount', () => {
            it('should not set $ctrl.data to data', () => {
                $ctrl.setData(data, 1);
                expect($ctrl.data).not.toEqual(data);
            });
        });
    });
});
