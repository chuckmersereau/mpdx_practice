import component from './preview.component';

describe('tools.import.csv.preview.component', () => {
    let $ctrl, rootScope, scope, componentController, gettextCatalog, importCsv, modal, contactsTags;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _gettextCatalog_, _importCsv_, _modal_, _contactsTags_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            gettextCatalog = _gettextCatalog_;
            importCsv = _importCsv_;
            modal = _modal_;
            contactsTags = _contactsTags_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('importCsvPreview', { $scope: scope }, {});
    }

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.accept).toBeFalsy();
        });
    });

    describe('$onInit', () => {
        it('should call contactsTags.load', () => {
            spyOn(contactsTags, 'load').and.returnValue();
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
            spyOn(importCsv, 'save').and.callFake(() => Promise.resolve());
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
            expect($ctrl.save()).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(modal, 'info').and.callFake((message) => Promise.resolve(message));
            });

            it('should set importCsv data to null', (done) => {
                $ctrl.save().then(() => {
                    expect(importCsv.data).toEqual(null);
                    done();
                });
            });

            it('should translate message', (done) => {
                spyOn(gettextCatalog, 'getString').and.returnValue();
                $ctrl.save().then(() => {
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(
                        'Your import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.'
                    );
                    done();
                });
            });

            it('should call modal info', (done) => {
                $ctrl.save().then(() => {
                    expect(modal.info).toHaveBeenCalledWith(
                        'Your import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.'
                    );
                    done();
                });
            });
        });
    });

    describe('back', () => {
        it('should call importCsv.back', () => {
            spyOn(importCsv, 'back').and.returnValue();
            $ctrl.back();
            expect(importCsv.back).toHaveBeenCalled();
        });
    });
});