import component from './headers.component';

describe('tools.import.csv.headers.component', () => {
    let $ctrl, rootScope, scope, componentController, gettextCatalog, importCsv, modal, serverConstants;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _importCsv_, _modal_, _serverConstants_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            importCsv = _importCsv_;
            modal = _modal_;
            serverConstants = _serverConstants_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('importCsvHeaders', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.unmappedHeaders).toEqual([]);
        });
    });

    describe('$onInit', () => {
        it('should call updateHeaders', () => {
            spyOn($ctrl, 'updateHeaders').and.returnValue();
            $ctrl.$onInit();
            expect($ctrl.updateHeaders).toHaveBeenCalled();
        });
    });

    describe('updateHeaders', () => {
        it('should set unmappedHeaders to the difference between required_headers and file_headers_mappings', () => {
            serverConstants.data = {
                csv_import: {
                    required_headers: {
                        first_name: 'First Name',
                        last_name: 'Last Name'
                    }
                }
            };
            importCsv.data = {
                file_headers_mappings: {
                    notes: 'notes',
                    language: 'likely_to_give'
                }
            };
            $ctrl.updateHeaders();
            expect($ctrl.unmappedHeaders).toEqual(['first_name', 'last_name']);
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(importCsv, 'save').and.callFake(() => Promise.resolve());
        });

        it('should call importCsv.save', () => {
            $ctrl.save();
            expect(importCsv.save).toHaveBeenCalled();
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });
    });

    describe('back', () => {
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => Promise.resolve());
        });

        it('should translate message', () => {
            spyOn(gettextCatalog, 'getString').and.returnValue();
            $ctrl.back();
            expect(gettextCatalog.getString).toHaveBeenCalledWith(
                'Are you sure you want to navigate back to the upload step? You will lose all unsaved progress.'
            );
        });

        it('should call modal.confirm', () => {
            $ctrl.back();
            expect(modal.confirm).toHaveBeenCalledWith(
                'Are you sure you want to navigate back to the upload step? You will lose all unsaved progress.'
            );
        });

        it('should return a promise', () => {
            expect($ctrl.back()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should call importCsv.back', (done) => {
                spyOn(importCsv, 'back').and.returnValue();
                $ctrl.back().then(() => {
                    expect(importCsv.back).toHaveBeenCalled();
                    done();
                });
            });
        });
    });
});