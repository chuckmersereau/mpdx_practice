import component from './collectionSelector.component';

describe('common.collectionSelector.component', () => {
    let $ctrl, componentController, scope, modal;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _modal_) => {
            componentController = $componentController;
            scope = $rootScope.$new();
            modal = _modal_;

            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('collectionSelector', { $scope: scope }, {
            displayText: 'display',
            itemName: 'contact',
            search: ({ text = 'text' }) => text,
            searchText: 'search',
            select: ({ item = {} }) => item
        });
    }

    describe('openModal', () => {
        beforeEach(() => {
            spyOn(modal, 'open').and.callFake(() => {});
        });

        it('should call modal.open', () => {
            $ctrl.openModal();
            const args = modal.open.calls.mostRecent().args[0];
            expect(args.template).toEqual(require('./modal/modal.html'));
            expect(args.controller).toEqual('collectionSelectionModalController');
            expect(args.locals.collectionSearch).toEqual(jasmine.any(Function));
            expect(args.locals.itemName).toEqual($ctrl.itemName);
            expect(args.locals.searchText).toEqual($ctrl.searchText);
            expect(args.locals.select).toEqual(jasmine.any(Function));
        });
    });

    describe('collectionSearch', () => {
        beforeEach(() => {
            spyOn($ctrl, 'search').and.callFake(() => {});
        });

        it('should call search bound function', () => {
            $ctrl.collectionSearch('test_text');
            expect($ctrl.search).toHaveBeenCalledWith({ text: 'test_text' });
        });
    });

    describe('collectionSelect', () => {
        beforeEach(() => {
            spyOn($ctrl, 'select').and.callFake(() => {});
        });

        it('should call search bound function', () => {
            $ctrl.collectionSelect({ id: 'item_id' });
            expect($ctrl.select).toHaveBeenCalledWith({ item: { id: 'item_id' } });
        });
    });

    describe('collectionSearchText', () => {
        describe('displayText and searchText are set', () => {
            beforeEach(() => {
                $ctrl.displayText = 'dt';
                $ctrl.searchText = 'st';
            });

            it('should return searchText', () => {
                expect($ctrl.collectionSearchText()).toEqual('st');
            });
        });

        describe('searchText is set', () => {
            beforeEach(() => {
                $ctrl.displayText = null;
                $ctrl.searchText = 'st';
            });

            it('should call search bound function', () => {
                expect($ctrl.collectionSearchText()).toEqual('st');
            });
        });

        describe('neither searchText or displayText are set', () => {
            beforeEach(() => {
                $ctrl.displayText = null;
                $ctrl.searchText = null;
            });

            it('should call search bound function', () => {
                expect($ctrl.collectionSearchText()).toEqual('');
            });
        });

        describe('displayText is set', () => {
            beforeEach(() => {
                $ctrl.displayText = 'dt';
                $ctrl.searchText = null;
            });

            it('should call search bound function', () => {
                expect($ctrl.collectionSearchText()).toEqual('dt');
            });
        });
    });
});
