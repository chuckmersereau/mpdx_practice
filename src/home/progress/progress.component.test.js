import component from './progress.component';
import moment from 'moment';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('home.progress.component', () => {
    let $ctrl, componentController, rootScope, scope, gettextCatalog, accounts, alerts, users, blockUI;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _accounts_, _alerts_, _users_, _blockUI_) => {
            componentController = $componentController;
            rootScope = $rootScope;
            scope = $rootScope.$new();

            gettextCatalog = _gettextCatalog_;
            accounts = _accounts_;
            alerts = _alerts_;
            users = _users_;
            blockUI = _blockUI_;
            loadController();
        });
    });

    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        spyOn(rootScope, '$on').and.callThrough();
        $ctrl = componentController('homeProgress', { $scope: scope }, { view: null });
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
        spyOn($ctrl.blockUI, 'start').and.callThrough();
    }

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
            spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
            $ctrl.$onInit();
            expect(users.listOrganizationAccounts).toHaveBeenCalled();
        });

        it('should call refreshData', () => {
            spyOn($ctrl, 'refreshData').and.callFake(() => Promise.resolve());
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
                spyOn($ctrl, 'refreshData').and.callFake(() => Promise.resolve());
                rootScope.$emit('accountListUpdated');
                expect($ctrl.refreshData).toHaveBeenCalled();
            });

            it('should call listOrganizationAccounts when event accountListUpdated triggered', () => {
                $ctrl.$onInit();
                spyOn(users, 'listOrganizationAccounts').and.callFake(() => Promise.resolve());
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
            spyOn($ctrl, 'refreshData').and.callFake(() => Promise.resolve());
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
            spyOn($ctrl, 'refreshData').and.callFake(() => Promise.resolve());
            $ctrl.previousWeek();
            expect($ctrl.refreshData).toHaveBeenCalled();
        });
    });

    describe('refreshData', () => {
        let spy;

        beforeEach(() => {
            spy = spyOn(accounts, 'getAnalytics').and.callFake(() => Promise.resolve());
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
            expect(accounts.getAnalytics).toHaveBeenCalledWith({ startDate: $ctrl.startDate, endDate: $ctrl.endDate });
        });

        it('should return promise', () => {
            expect($ctrl.refreshData()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call blockUI.reset', (done) => {
                $ctrl.refreshData().then(() => {
                    expect($ctrl.blockUI.reset).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spy.and.callFake(() => Promise.reject(Error('something went wrong')));
            });

            it('should call blockUI.reset', (done) => {
                $ctrl.refreshData().catch(() => {
                    expect($ctrl.blockUI.reset).toHaveBeenCalled();
                    done();
                });
            });

            it('should call alerts.addAlert', (done) => {
                spyOn(alerts, 'addAlert').and.returnValue();
                $ctrl.refreshData().catch(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith('Unable to update Progress Report', 'danger');
                    done();
                });
            });

            it('should call gettext.getString', (done) => {
                spyOn(gettextCatalog, 'getString').and.returnValue();
                $ctrl.refreshData().catch(() => {
                    expect(gettextCatalog.getString).toHaveBeenCalledWith('Unable to update Progress Report');
                    done();
                });
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
