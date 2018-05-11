import * as moment from 'moment';
import component from './progress.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('home.progress.component', () => {
    let $ctrl, componentController, rootScope, scope, gettextCatalog, accounts, users, blockUI, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _accounts_, _users_, _blockUI_, $q) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            accounts = _accounts_;
            users = _users_;
            blockUI = _blockUI_;
            q = $q;
            spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
            spyOn(rootScope, '$on').and.callThrough();
            $ctrl = componentController('homeProgress', { $scope: scope }, { view: null });
            spyOn(gettextCatalog, 'getString').and.callThrough();
            spyOn($ctrl.blockUI, 'reset').and.callThrough();
            spyOn($ctrl.blockUI, 'start').and.callThrough();
        });
    });

    describe('constructor', () => {
        it('should get instance of blockUI', () => {
            expect(blockUI.instances.get).toHaveBeenCalledWith('homeProgress');
            expect($ctrl.blockUI).toEqual(fakeBlockUI);
        });

        it('should set default values', () => {
            expect($ctrl.endDate).toEqual(moment().endOf('week'));
            expect($ctrl.startDate).toEqual(moment($ctrl.endDate).subtract(1, 'week').add(1, 'day'));
            expect($ctrl.errorOccurred).toBeFalsy();
        });
    });

    describe('$onInit', () => {
        it('should call listOrganizationAccounts', () => {
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
            $ctrl.$onInit();
            expect(users.listOrganizationAccounts).toHaveBeenCalled();
        });

        it('should call refreshData', () => {
            spyOn($ctrl, 'refreshData').and.callFake(() => q.resolve());
            $ctrl.$onInit();
            expect($ctrl.refreshData).toHaveBeenCalled();
        });

        it('should set watcher on accountListUpdated', () => {
            $ctrl.$onInit();
            expect(rootScope.$on).toHaveBeenCalledWith('accountListUpdated', jasmine.any(Function));
        });

        describe('accountListUpdated event', () => {
            it('should call refreshData when event accountListUpdated triggered', () => {
                $ctrl.$onInit();
                spyOn($ctrl, 'refreshData').and.callFake(() => q.resolve());
                rootScope.$emit('accountListUpdated');
                expect($ctrl.refreshData).toHaveBeenCalled();
            });

            it('should call listOrganizationAccounts when event accountListUpdated triggered', () => {
                $ctrl.$onInit();
                spyOn(users, 'listOrganizationAccounts').and.callFake(() => q.resolve());
                rootScope.$emit('accountListUpdated');
                expect(users.listOrganizationAccounts).toHaveBeenCalledWith(true);
            });
        });
    });

    describe('nextWeek', () => {
        const date = moment().endOf('week');

        it('should advance startDate by one week', () => {
            $ctrl.startDate = date;
            $ctrl.nextWeek();
            expect($ctrl.startDate).toEqual(date.add(1, 'week'));
        });

        it('should advance endDate by one week', () => {
            $ctrl.endDate = date;
            $ctrl.nextWeek();
            expect($ctrl.endDate).toEqual(date.add(1, 'week'));
        });

        it('should call refershData', () => {
            spyOn($ctrl, 'refreshData').and.callFake(() => q.resolve());
            $ctrl.nextWeek();
            expect($ctrl.refreshData).toHaveBeenCalled();
        });
    });

    describe('previousWeek', () => {
        const date = moment().endOf('week');

        it('should reduce startDate by one week', () => {
            $ctrl.startDate = date;
            $ctrl.previousWeek();
            expect($ctrl.startDate).toEqual(date.subtract(1, 'week'));
        });

        it('should reduce endDate by one week', () => {
            $ctrl.endDate = date;
            $ctrl.nextWeek();
            expect($ctrl.endDate).toEqual(date.subtract(1, 'week'));
        });

        it('should call refershData', () => {
            spyOn($ctrl, 'refreshData').and.callFake(() => q.resolve());
            $ctrl.previousWeek();
            expect($ctrl.refreshData).toHaveBeenCalled();
        });
    });

    describe('refreshData', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(accounts, 'getAnalytics').and.callFake(() => q.resolve());
        });

        it('should call blockUI.start', () => {
            $ctrl.refreshData();
            expect($ctrl.blockUI.start).toHaveBeenCalled();
        });

        it('should set accounts.analytics to null', () => {
            accounts.analytics = {};
            $ctrl.refreshData();
            expect(accounts.analytics).toBeNull();
        });

        it('should call accounts.getAnalytics', () => {
            $ctrl.refreshData();
            const errorMessage = 'Unable to update Progress Report';
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(accounts.getAnalytics).toHaveBeenCalledWith(
                { startDate: $ctrl.startDate, endDate: $ctrl.endDate },
                errorMessage
            );
        });

        it('should return promise', () => {
            expect($ctrl.refreshData()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should call blockUI.reset', (done) => {
                $ctrl.refreshData().then(() => {
                    expect($ctrl.blockUI.reset).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });
        });

        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => q.reject(Error('something went wrong')));
            });

            it('should call blockUI.reset', (done) => {
                $ctrl.refreshData().catch(() => {
                    expect($ctrl.blockUI.reset).toHaveBeenCalled();
                    done();
                });
                scope.$digest();
            });
        });
    });

    describe('showWeeklyProgressReport', () => {
        describe('organization Cru - USA is present', () => {
            beforeEach(() => {
                users.organizationAccounts = [
                    { organization: { name: 'ToonTown Ministries' } },
                    { organization: { name: 'Cru - USA' } }
                ];
            });

            it('should return true', () => {
                expect($ctrl.showWeeklyProgressReport()).toBeTruthy();
            });
        });

        describe('organization Cru - USA is not present', () => {
            beforeEach(() => {
                users.organizationAccounts = [
                    { organization: { name: 'ToonTown Ministries' } },
                    { organization: { name: 'Power To Change' } }
                ];
            });

            it('should return false', () => {
                expect($ctrl.showWeeklyProgressReport()).toBeFalsy();
            });
        });
    });
});
