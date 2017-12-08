import list from './selector.component';

let defaultModel = ['a'];
let tagList = [{ name: 'a' }, { name: 'b' }];
const element = angular.element('<div></div>')

describe('common.contactsSelector.component', () => {
    let $ctrl, rootScope, scope, componentController;
    beforeEach(() => {
        angular.mock.module(list);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('contactsSelector', { $scope: scope, $element: element }, {
            ngModel: defaultModel,
            tagList: tagList,
            onTagAdded: () => {},
            onTagRemoved: () => {}
        });
    }
    describe('constructor', () => {
        it('should expose contacts service to view', () => {
            expect($ctrl.contacts).toBeDefined();
        });
    });
    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'init').and.callFake(() => {});
        });
        it('should call init', () => {
            $ctrl.$onInit();
            expect($ctrl.init).toHaveBeenCalled();
        });
    });
    describe('init', () => {
        it('should force model to be an array', () => {
            $ctrl.ngModel = '';
            $ctrl.init();
            expect($ctrl.ngModel).toEqual([]);
        });
        it('should copy model to selectedTags', () => {
            $ctrl.init();
            expect($ctrl.selectedContacts).toEqual($ctrl.ngModel);
            expect($ctrl.selectedContacts !== $ctrl.ngModel).toEqual(true);
        });
    });
    describe('addContact', () => {
        beforeEach(() => {
            $ctrl.ngModel = [{ id: 1 }];
        });
        it('should add a tag to model', () => {
            $ctrl.addContact({ id: 2 });
            expect($ctrl.ngModel).toEqual([{ id: 1 }, { id: 2 }]);
        });
    });
    describe('removeContact', () => {
        beforeEach(() => {
            $ctrl.ngModel = [{ id: 1 }];
        });
        it('should remove a tag from model', () => {
            scope.$digest();
            $ctrl.removeContact({ id: 1 });
            expect($ctrl.ngModel).toEqual([]);
        });
    });
});
