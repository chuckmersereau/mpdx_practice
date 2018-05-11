import modalController from './modal.controller';

describe('common.collectionSelector.modal.controller', () => {
    let $ctrl, controller, scope, q;

    function loadController() {
        $ctrl = controller('collectionSelectionModalController as $ctrl', {
            $scope: scope,
            itemName: 'contact',
            collectionSearch: () => q.resolve(),
            searchText: 'Smith, John',
            select: () => {}
        });
    }

    beforeEach(() => {
        angular.mock.module(modalController);
        inject(($controller, $rootScope, $q) => {
            controller = $controller;
            scope = $rootScope.$new();
            q = $q;
            scope.$hide = () => {};

            loadController();
        });
    });

    describe('constructor', () => {
        it('should set the itemName', () => {
            expect($ctrl.itemName).toEqual('contact');
        });

        it('should set the searchText', () => {
            expect($ctrl.searchText).toEqual('Smith, John');
        });

        it('should set the collectionSearch', () => {
            expect($ctrl.collectionSearch).toEqual(jasmine.any(Function));
        });

        it('should set the select', () => {
            expect($ctrl.select).toEqual(jasmine.any(Function));
        });

        it('should set the collection', () => {
            expect($ctrl.collection).toEqual([]);
        });

        it('should set the selectedItem', () => {
            expect($ctrl.selectedItem).toEqual(null);
        });
    });

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn($ctrl, 'collectionSearch').and.callFake(() => q.resolve());
        });

        describe('searchText present', () => {
            beforeEach(() => {
                $ctrl.searchText = 'abc';
            });

            it('should call collectionSearch', () => {
                $ctrl.$onInit();
                expect($ctrl.collectionSearch).toHaveBeenCalled();
            });
        });

        describe('searchText not present', () => {
            beforeEach(() => {
                $ctrl.searchText = null;
            });

            it('should call collectionSearch', () => {
                $ctrl.$onInit();
                expect($ctrl.collectionSearch).not.toHaveBeenCalled();
            });
        });
    });

    describe('search', () => {
        beforeEach(() => {
            spyOn($ctrl, 'collectionSearch').and.callFake((data) => q.resolve(data));
        });

        it('should clear selectedItem', () => {
            $ctrl.selectedItem = {};
            $ctrl.search();
            expect($ctrl.selectedItem).toEqual(null);
        });

        it('should clear collection', () => {
            $ctrl.collection = [{}];
            $ctrl.search();
            expect($ctrl.collection).toEqual([]);
        });

        it('should set loading to true', () => {
            $ctrl.loading = false;
            $ctrl.search();
            expect($ctrl.loading).toEqual(true);
        });

        it('should call collectionSearch', () => {
            $ctrl.search();
            expect($ctrl.collectionSearch).toHaveBeenCalledWith($ctrl.searchText);
        });

        it('should return a promise', () => {
            expect($ctrl.search()).toEqual(jasmine.any(q));
        });

        describe('promise resolved', () => {
            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.search().then(() => {
                    expect($ctrl.loading).toBeFalsy();
                    done();
                });
                scope.$digest();
            });

            it('should set data to collection', (done) => {
                $ctrl.search().then(() => {
                    expect($ctrl.collection).toEqual($ctrl.searchText);
                    done();
                });
                scope.$digest();
            });
        });

        describe('empty searchText', () => {
            beforeEach(() => {
                $ctrl.searchText = '';
            });

            it('should not set loading to true', () => {
                $ctrl.loading = false;
                $ctrl.search();
                expect($ctrl.loading).not.toEqual(true);
            });

            it('should not call collectionSearch', () => {
                $ctrl.search();
                expect($ctrl.collectionSearch).not.toHaveBeenCalled();
            });

            it('should return rejected promise', () => {
                expect($ctrl.search()).toEqual(jasmine.any(q));
            });
        });

        describe('null searchText', () => {
            beforeEach(() => {
                $ctrl.searchText = null;
            });

            it('should not set loading to true', () => {
                $ctrl.loading = false;
                $ctrl.search();
                expect($ctrl.loading).not.toEqual(true);
            });

            it('should not call collectionSearch', () => {
                $ctrl.search();
                expect($ctrl.collectionSearch).not.toHaveBeenCalled();
            });

            it('should return rejected promise', () => {
                expect($ctrl.search()).toEqual(jasmine.any(q));
            });
        });
    });

    describe('save', () => {
        it('should call $hide', () => {
            spyOn(scope, '$hide').and.callFake(() => {});
            $ctrl.save();
            expect(scope.$hide).toHaveBeenCalled();
        });

        it('should call select', () => {
            spyOn($ctrl, 'select').and.callFake(() => {});
            $ctrl.save();
            expect($ctrl.select).toHaveBeenCalled();
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(q));
        });
    });
});
