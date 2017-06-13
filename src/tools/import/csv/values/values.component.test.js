import component from './values.component';

describe('tools.import.csv.values.component', () => {
    let $ctrl, rootScope, scope, componentController, importCsv;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _importCsv_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            importCsv = _importCsv_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('importCsvValues', { $scope: scope }, {});
    }

    describe('save', () => {
        it('should call importCsv.save', () => {
            spyOn(importCsv, 'save').and.returnValue();
            $ctrl.save();
            expect(importCsv.save).toHaveBeenCalled();
        });
    });

    describe('back', () => {
        it('should call importCsv.back', () => {
            spyOn(importCsv, 'back').and.returnValue();
            $ctrl.back();
            expect(importCsv.back).toHaveBeenCalled();
        });
    });

    describe('fileHeader', () => {
        beforeEach(() => {
            importCsv.data = {
                file_headers: {
                    categories: 'Categories'
                },
                file_headers_mappings: {
                    categories: 'status'
                }
            };
        });

        it('should return header name', () => {
            expect($ctrl.fileHeader('status')).toEqual('Categories');
        });
    });
});