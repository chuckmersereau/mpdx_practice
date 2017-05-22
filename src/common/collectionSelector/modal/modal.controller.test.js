import modalController from './modal.controller';
import isEqual from 'lodash/fp/isEqual';

describe('common.collectionSelector.modal.controller', () => {
    let $ctrl, controller, scope;
    beforeEach(() => {
        angular.mock.module(modalController);
        inject(($controller, $rootScope) => {
            controller = $controller;
            scope = $rootScope.$new();
            scope.$hide = () => {};

            loadController();
        });
    });

    function loadController() {
        $ctrl = controller('collectionSelectionModalController as $ctrl', {
            $scope: scope,
            itemName: 'contact',
            collectionSearch: () => {},
            searchText: 'Smith, John',
            select: () => {}
        });
    }

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
            spyOn($ctrl, 'search').and.returnValue();
            $ctrl.$onInit();
        });

        it('should call search', () => {
            expect($ctrl.search).toHaveBeenCalled();
        });
    });

    describe('search', () => {
        beforeEach(() => {
            spyOn($ctrl, 'collectionSearch').and.callFake((data) => Promise.resolve(data));
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
            expect($ctrl.search()).toEqual(jasmine.any(Promise));
        });
        describe('promise resolved', () => {
            it('should set loading to false', (done) => {
                $ctrl.loading = true;
                $ctrl.search().then(() => {
                    expect($ctrl.loading).toBeFalsy();
                    done();
                });
            });
            it('should set data to collection', (done) => {
                $ctrl.search().then(() => {
                    expect($ctrl.collection).toEqual($ctrl.searchText);
                    done();
                });
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
                expect($ctrl.search()).toEqual(jasmine.any(Promise));
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
                expect($ctrl.search()).toEqual(jasmine.any(Promise));
            });
        });
    });

    describe('save', () => {
        it('should call $hide', () => {
            spyOn(scope, '$hide').and.returnValue();
            $ctrl.save();
            expect(scope.$hide).toHaveBeenCalled();
        });

        it('should call select', () => {
            spyOn($ctrl, 'select').and.returnValue();
            $ctrl.save();
            expect($ctrl.select).toHaveBeenCalled();
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });
    });
});
