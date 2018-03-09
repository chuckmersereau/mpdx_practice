import component from './item.component';
import moment from 'moment';

describe('tasks.list.drawer.contact.component', () => {
    let $ctrl, rootScope, scope, serverConstants, alerts, _$window;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _serverConstants_, _alerts_, $window) => {
            rootScope = $rootScope;
            alerts = _alerts_;
            serverConstants = _serverConstants_;
            _$window = $window;
            scope = rootScope.$new();
            $ctrl = $componentController('taskListContact', { $scope: scope });
        });
        serverConstants.data = {
            pledge_currencies: {
                usd: {
                    code: 'USD',
                    name: 'US Dollar'
                }
            }
        };
        spyOn(alerts, 'addAlert').and.callFake((data) => data);
        spyOn($ctrl, 'gettext').and.callFake((data) => data);
    });
    describe('$onInit', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        it('should set tagsExpanded', () => {
            expect($ctrl.tagsExpanded).toBeFalsy();
        });
        it('should set isSafari', () => {
            expect($ctrl.isSafari).toBeFalsy();
        });
    });
    describe('$onChanges', () => {
        beforeEach(() => {
            $ctrl.contact = { id: 1, pledge_currency: 'USD' };
            $ctrl.$onChanges();
        });
        it('should set currency', () => {
            expect($ctrl.currency).toEqual('US Dollar');
        });
    });
    describe('daysLate', () => {
        describe('contact late_at 60 days ago', () => {
            beforeEach(() => {
                $ctrl.contact = { late_at: moment().subtract(60, 'days').format('YYYY-MM-DD') };
            });
            it('should return 60', () => {
                expect($ctrl.daysLate()).toEqual(60);
            });
        });
        describe('contact late_at null', () => {
            beforeEach(() => {
                $ctrl.contact = { late_at: null };
            });
            it('should return 0', () => {
                expect($ctrl.daysLate()).toEqual(0);
            });
        });
        describe('contact late_at not set', () => {
            beforeEach(() => {
                $ctrl.contact = {};
            });
            it('should return 0', () => {
                expect($ctrl.daysLate()).toEqual(0);
            });
        });
    });
    describe('expandTags', () => {
        it('should reverse tagsExpanded value', () => {
            $ctrl.tagsExpanded = false;
            $ctrl.expandTags();
            expect($ctrl.tagsExpanded).toBeTruthy();
            $ctrl.expandTags();
            expect($ctrl.tagsExpanded).toBeFalsy();
        });
    });
    describe('emailAll', () => {
        it('should open a mailto window', () => {
            spyOn(_$window, 'open').and.callFake(() => ({ close: () => {} }));
            $ctrl.contact = { people: [{ email_addresses: [{ primary: true, email: 'a@b.c' }, { email: 'b@b.c' }] }] };
            $ctrl.emailAll();
            expect(_$window.open).toHaveBeenCalledWith('mailto:a@b.c');
        });
    });
});
