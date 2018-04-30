import component from './item.component';
import * as moment from 'moment';

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
    describe('$onInit', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        afterEach(() => {
            $ctrl.$onDestroy();
        });
        it('should handle contactTagDeleted', () => {
            $ctrl.contact = { id: 1, tag_list: ['a'] };
            rootScope.$emit('contactTagDeleted', { contactIds: [1], tag: 'a' });
            rootScope.$digest();
            expect($ctrl.contact.tag_list).toEqual([]);
        });
        it('should handle contactTagsAdded', () => {
            $ctrl.contact = { id: 1, tag_list: [] };
            rootScope.$emit('contactTagsAdded', { contactIds: [1], tags: ['a'] });
            rootScope.$digest();
            expect($ctrl.contact.tag_list).toEqual(['a']);
        });
    });
    describe('$onDestroy', () => {
        beforeEach(() => {
            $ctrl.$onInit();
        });
        it('should remove watchers', () => {
            spyOn($ctrl, 'watcher').and.callFake(() => {});
            spyOn($ctrl, 'watcher2').and.callFake(() => {});
            $ctrl.$onDestroy();
            expect($ctrl.watcher).toHaveBeenCalledWith();
            expect($ctrl.watcher2).toHaveBeenCalledWith();
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
    describe('showCaret', () => {
        it('should call isOverFlown', () => {
            const element = `#tags_list_${scope.$id}`;
            spyOn(document, 'querySelector').and.callFake(() => 'a');
            spyOn($ctrl, 'isOverflown').and.callFake(() => {});
            $ctrl.showCaret();
            expect($ctrl.isOverflown).toHaveBeenCalledWith('a');
            expect(document.querySelector).toHaveBeenCalledWith(element);
        });
    });
});
