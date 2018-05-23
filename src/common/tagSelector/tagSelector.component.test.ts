import list from './tagSelector.component';

let defaultModel = ['a'];
let tagList = [{ name: 'a' }, { name: 'b' }];

describe('common.tagSelector.component', () => {
    let $ctrl, rootScope, scope, componentController;

    function loadController() {
        $ctrl = componentController('tagSelector', { $scope: scope }, {
            ngModel: defaultModel,
            tagList: tagList,
            onTagAdded: () => {},
            onTagRemoved: () => {}
        });
    }

    beforeEach(() => {
        angular.mock.module(list);
        inject(($componentController, $rootScope) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            componentController = $componentController;
            loadController();
        });
    });

    describe('constructor', () => {
        it('should set tags to empty array', () => {
            expect($ctrl.tags).toEqual([]);
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

        it('should map tagList to tags', () => {
            $ctrl.init();
            expect($ctrl.tags).toEqual(tagList);
        });

        it('should map unnamed tagList to tags', () => {
            $ctrl.tagList = ['a', 'b'];
            $ctrl.init();
            expect($ctrl.tags).toEqual(tagList);
        });

        it('should copy model to selectedTags', () => {
            $ctrl.init();
            expect($ctrl.selectedTags).toEqual($ctrl.ngModel);
            expect($ctrl.selectedTags !== $ctrl.ngModel).toEqual(true);
        });
    });

    describe('addTag', () => {
        beforeEach(() => {
            $ctrl.ngModel = ['a'];
        });

        it('should add a tag to model', () => {
            $ctrl.addTag({ name: 'c' });
            expect($ctrl.ngModel).toEqual(['a', 'c']);
        });
    });

    describe('removeTag', () => {
        beforeEach(() => {
            $ctrl.ngModel = ['a'];
        });

        it('should remove a tag from model', () => {
            scope.$digest();
            $ctrl.removeTag({ name: 'a' });
            expect($ctrl.ngModel).toEqual([]);
        });
    });

    describe('filterTags', () => {
        beforeEach(() => {
            $ctrl.tagList = tagList;
            $ctrl.init();
        });

        it('should return a filtered list', () => {
            expect($ctrl.filterTags('a')).toEqual([{ name: 'a' }]);
        });
    });
});
