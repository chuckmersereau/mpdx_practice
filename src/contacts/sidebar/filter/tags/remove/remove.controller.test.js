import remove from './remove.controller';
import assign from 'lodash/fp/assign';

describe('contacts.sidebar.tags.remove.controller', () => {
    let $ctrl, controller, contactsTags, scope, rootScope;
    let defaultScope = () => {
        return {
            $scope: scope,
            selectedContacts: [{id: 1, tag_list: ['b']}, {id: 2, tag_list: ['a']}],
            currentListSize: 25
        };
    };
    beforeEach(() => {
        angular.mock.module(remove);
        inject(($controller, $rootScope, _contactsTags_) => {
            rootScope = $rootScope.$new();
            scope = rootScope.$new();
            contactsTags = _contactsTags_;
            contactsTags.data = [{name: 'b'}, {name: 'c'}];
            controller = $controller;
            $ctrl = loadController(defaultScope());
        });
    });
    function loadController(scope) {
        return controller('removeTagController as $ctrl', scope);
    }
    describe('removeTag', () => {
        beforeEach(() => {
            spyOn(contactsTags, 'untagContact').and.callFake(() => Promise.resolve({}));
            spyOn(contactsTags, 'load').and.callFake(() => {});
            scope.$hide = () => {};
            // spyOn(scope, '$hide()').and.callThrough();
            spyOn(rootScope, '$emit').and.callThrough();
        });
        it('should remove a tag from selected contacts', () => {
            $ctrl.removeTag('a');
            expect(contactsTags.untagContact).toHaveBeenCalledWith([1, 2], 'a');
        });
        xit('should call event contactCreated', (done) => {
            let called = false;
            rootScope.$on('contactCreated', () => {
                called = true;
            });
            $ctrl.removeTag('a').then(() => {
                rootScope.$digest();
                expect(called).toBeTruthy();
                done();
            });
        });
        it('should reload tag list', (done) => {
            $ctrl.removeTag('a').then(() => {
                expect(contactsTags.load).toHaveBeenCalled();
                done();
            });
        });
        xit('should hide the modal', (done) => {
            scope.$hide = () => {};
            $ctrl.removeTag('a').then(() => {
                expect(scope.$hide).toHaveBeenCalled();
                done();
            });
        });
    });
    describe('getTagsFromSelectedContacts', () => {
        it('should show a sorted list of tags', () => {
            expect($ctrl.getTagsFromSelectedContacts()).toEqual(['a', 'b']);
        });
        it('should show a complete list of tags if selected > data', () => {
            $ctrl = loadController(assign(defaultScope(), {currentListSize: 1}));
            expect($ctrl.getTagsFromSelectedContacts()).toEqual(['b', 'c']);
        });
    });
});