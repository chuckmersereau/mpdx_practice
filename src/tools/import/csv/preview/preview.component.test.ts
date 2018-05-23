import component from './preview.component';

describe('tools.import.csv.preview.component', () => {
    let $ctrl, rootScope, scope, gettextCatalog, importCsv, modal, contactsTags, q;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _importCsv_, _modal_, _contactsTags_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            importCsv = _importCsv_;
            modal = _modal_;
            contactsTags = _contactsTags_;
            q = $q;
            $ctrl = $componentController('importCsvPreview', { $scope: scope }, {});
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.accept).toBeFalsy();
        });
    });

    describe('$onInit', () => {
        it('should call contactsTags.load', () => {
            spyOn(contactsTags, 'load').and.callFake(() => {});
            $ctrl.$onInit();
            expect(contactsTags.load).toHaveBeenCalled();
        });
    });

    describe('events', () => {
        it('should handle account list change', () => {
            spyOn(contactsTags, 'load').and.callFake(() => {});
            rootScope.$emit('accountListUpdated');
            rootScope.$digest();
            expect(contactsTags.load).toHaveBeenCalled();
        });
    });

    describe('save', () => {
        beforeEach(() => {
            importCsv.data = { in_preview: true };
            spyOn(importCsv, 'save').and.callFake(() => q.resolve());
        });

        it('should call importCsv.save', () => {
            $ctrl.save();
            expect(importCsv.save).toHaveBeenCalled();
        });

        it('should set in_preview to false', () => {
            $ctrl.save();
            expect(importCsv.data.in_preview).toBeFalsy();
        });

        it('should return a promise', () => {
            expect($ctrl.save()).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(modal, 'info').and.callFake((message) => q.resolve(message));
            });

            it('should set importCsv data to null', (done) => {
                $ctrl.save().then(() => {
                    expect(importCsv.data).toEqual(null);
                    done();
                });
                rootScope.$digest();
            });

            it('should translate message', (done) => {
                spyOn(gettextCatalog, 'getString').and.callFake(() => {});
                $ctrl.save().then(() => {
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(
                        'Your CSV import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.'
                    );
                    done();
                });
                rootScope.$digest();
            });

            it('should call modal info', (done) => {
                $ctrl.save().then(() => {
                    expect(modal.info).toHaveBeenCalledWith(
                        'Your CSV import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.'
                    );
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('back', () => {
        it('should call importCsv.back', () => {
            spyOn(importCsv, 'back').and.callFake(() => {});
            $ctrl.back();
            expect(importCsv.back).toHaveBeenCalled();
        });
    });
});