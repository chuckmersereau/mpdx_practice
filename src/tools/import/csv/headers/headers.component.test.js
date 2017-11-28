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
            expect($ctrl.mappedHeaders).toEqual([]);
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
        beforeEach(() => {
            serverConstants.data = {
                csv_import: {
                    required_headers: {
                        first_name: 'First Name',
                        last_name: 'Last Name',
                        status: 'Status'
                    }
                }
            };
            importCsv.data = {
                file_headers_mappings: {
                    notes: 'notes',
                    language: 'likely_to_give'
                }
            };
        });

        it('should set unmappedHeaders to required_headers - file_headers_mappings + [first_name, last_name, full_name]', () => {
            $ctrl.updateHeaders();
            expect($ctrl.unmappedHeaders).toEqual(['first_name', 'last_name', 'status', 'full_name']);
        });

        it('should set mappedHeaders to array of values of the file_headers_mappings', () => {
            $ctrl.updateHeaders();
            expect($ctrl.mappedHeaders).toEqual(['notes', 'likely_to_give']);
        });

        describe('full_name set', () => {
            beforeEach(() => {
                importCsv.data.file_headers_mappings.full_name = 'full_name';
            });

            it('should set unmappedHeaders to required_headers - file_headers_mappings - [first_name, last_name, full_name]', () => {
                $ctrl.updateHeaders();
                expect($ctrl.unmappedHeaders).toEqual(['status']);
            });
        });

        describe('first_name & last_name set', () => {
            beforeEach(() => {
                importCsv.data.file_headers_mappings.first_name = 'first_name';
                importCsv.data.file_headers_mappings.last_name = 'last_name';
            });

            it('should set unmappedHeaders to required_headers - file_headers_mappings - [first_name, last_name, full_name]', () => {
                $ctrl.updateHeaders();
                expect($ctrl.unmappedHeaders).toEqual(['status']);
            });
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(importCsv, 'save').and.callFake(() => Promise.resolve());
            importCsv.values_to_constants_mappings = { 'test': 'test' };
        });

        it('should set values_to_constants_mappings to {}', () => {
            $ctrl.save();
            expect(importCsv.values_to_constants_mappings).toEqual({});
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
