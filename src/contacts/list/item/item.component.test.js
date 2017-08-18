import component from './item.component';
import moment from 'moment';

describe('contacts.list.item', () => {
    let $ctrl, rootScope, scope;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $ctrl = $componentController('contactsListItem', { $scope: scope });
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
});
