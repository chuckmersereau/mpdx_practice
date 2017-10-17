import component from './list.component';

describe('coaches.list', () => {
    let $ctrl, api, rootScope, scope;

    beforeEach(() => {
        angular.mock.module(component);

        inject((
            $componentController, $rootScope,
            _api_
        ) => {
            api = _api_;
            rootScope = $rootScope;
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
            expect($ctrl.page).toEqual(1);
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

            spyOn(api, 'get').and.callFake(() => Promise.resolve(data));
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.load();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call reset', () => {
            spyOn($ctrl, 'reset').and.callFake(() => {});
            $ctrl.load();
            expect($ctrl.reset).toHaveBeenCalled();
        });

        describe('not reset', () => {
            it('should not call reset', () => {
                spyOn($ctrl, 'reset').and.callFake(() => {});
                $ctrl.load(2);
                expect($ctrl.reset).not.toHaveBeenCalled();
            });
        });

        it('should set page', () => {
            $ctrl.page = 2;
            $ctrl.load();
            expect($ctrl.page).toEqual(1);
        });

        it('should call api.get', () => {
            $ctrl.load();
            expect(api.get).toHaveBeenCalledWith({
                url: 'coaching_account_lists',
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
            expect($ctrl.load()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.loading).toEqual(false);
                    done();
                });
            });

            it('should call setData', (done) => {
                spyOn($ctrl, 'setData').and.callFake(() => {});
                $ctrl.loading = true;
                $ctrl.load().then(() => {
                    expect($ctrl.setData).toHaveBeenCalledWith(data, true, 1);
                    done();
                });
            });

            describe('not reset', () => {
                it('should call setData', (done) => {
                    spyOn($ctrl, 'setData').and.callFake(() => {});
                    $ctrl.loading = true;
                    $ctrl.load(2).then(() => {
                        expect($ctrl.setData).toHaveBeenCalledWith(data, false, 0);
                        done();
                    });
                });
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
            $ctrl.setData(data, true, 0);
            expect($ctrl.data).toEqual(data);
        });

        it('should set $ctrl.meta to data.meta', () => {
            $ctrl.setData(data, true, 0);
            expect($ctrl.meta).toEqual(data.meta);
        });

        describe('currentCount !== listLoadCount', () => {
            it('should not set $ctrl.data to data', () => {
                $ctrl.setData(data, true, 1);
                expect($ctrl.data).not.toEqual(data);
            });
        });

        describe('not reset', () => {
            it('joins data to $ctrl.data', () => {
                $ctrl.data = [{
                    id: 'account_list_id_0'
                }];
                $ctrl.setData(data, false, 0);
                expect($ctrl.data).toEqual([{
                    id: 'account_list_id_0'
                }, {
                    id: 'account_list_id_1'
                }]);
            });
        });
    });

    describe('loadMoreCoachingAccountLists', () => {
        beforeEach(() => {
            spyOn($ctrl, 'load').and.callFake(() => Promise.resolve());
            $ctrl.page = 0;
            $ctrl.loading = false;
            $ctrl.meta = { pagination: { total_pages: 4 } };
        });
        it('should call load', () => {
            $ctrl.loadMoreCoachingAccountLists();
            expect($ctrl.load).toHaveBeenCalledWith(1);
        });
        it('should exit if already loading', () => {
            $ctrl.loading = true;
            $ctrl.loadMoreCoachingAccountLists();
            expect($ctrl.load).not.toHaveBeenCalled();
        });
        it('should exit if on last page of results', () => {
            $ctrl.page = 4;
            $ctrl.loadMoreCoachingAccountLists();
            expect($ctrl.load).not.toHaveBeenCalled();
        });
    });
});