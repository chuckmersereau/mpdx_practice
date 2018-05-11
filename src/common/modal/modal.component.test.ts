import { Promise } from 'core-js';
import component from './modal.component';

const defaultBindings = {
    title: '',
    size: '',
    cancel: () => {},
    cancelText: '',
    delete: () => Promise.resolve(),
    save: () => Promise.resolve(),
    saveText: ''
};

describe('common.modal.component', () => {
    let $ctrl, componentController, scope, blockUI, $timeout;

    function loadController(bindings = defaultBindings) {
        $ctrl = componentController('modal', { $scope: scope, $element: {}, $attrs: {} }, bindings);
    }

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _$timeout_) => {
            componentController = $componentController;
            scope = $rootScope.$new();
            $timeout = _$timeout_;
            loadController();
        });
        blockUI = $ctrl.blockUI;
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect($ctrl.saving).toBeFalsy();
        });
    });

    describe('deleteAndBlock', () => {
        beforeEach(() => {
            spyOn(blockUI, 'start').and.callFake(() => {});
            spyOn(blockUI, 'reset').and.callFake(() => {});
        });

        it('should mark saving bool', () => {
            $ctrl.deleteAndBlock();
            expect($ctrl.saving).toBeTruthy();
        });

        it('should block the UI', () => {
            $ctrl.deleteAndBlock();
            expect(blockUI.start).toHaveBeenCalled();
        });

        it('should call delete', () => {
            spyOn($ctrl, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.deleteAndBlock();
            expect($ctrl.delete).toHaveBeenCalled();
        });

        it('should reset the blockUI', (done) => {
            spyOn($ctrl, 'delete').and.callFake(() => Promise.resolve());
            $ctrl.deleteAndBlock().then(() => {
                expect(blockUI.reset).toHaveBeenCalled();
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });

        it('should reset the blockUI on reject', (done) => {
            spyOn($ctrl, 'delete').and.callFake(() => Promise.reject(Error('')));
            $ctrl.deleteAndBlock().catch(() => {
                expect(blockUI.reset).toHaveBeenCalled();
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            scope.$digest();
        });
    });

    describe('saveAndBlock', () => {
        beforeEach(() => {
            spyOn(blockUI, 'start').and.callFake(() => {});
            spyOn(blockUI, 'reset').and.callFake(() => {});
        });

        it('should mark saving bool', () => {
            $ctrl.saveAndBlock();
            expect($ctrl.saving).toBeTruthy();
        });

        it('should block the UI', () => {
            $ctrl.saveAndBlock();
            expect(blockUI.start).toHaveBeenCalled();
        });

        it('should call save', () => {
            spyOn($ctrl, 'save').and.callFake(() => Promise.resolve());
            $ctrl.saveAndBlock();
            $ctrl.$timeout.flush();
            expect($ctrl.save).toHaveBeenCalled();
        });

        xit('should reset the blockUI and mark saving false', (done) => {
            spyOn($ctrl, 'save').and.callFake(() => Promise.resolve());
            $ctrl.saveAndBlock().then(() => {
                expect(blockUI.reset).toHaveBeenCalled();
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            $timeout.flush();
            scope.$digest();
        });

        xit('should reset the blockUI on reject and mark saving false', (done) => {
            spyOn($ctrl, 'save').and.callFake(() => Promise.reject(Error('')));
            $ctrl.saveAndBlock().catch(() => {
                expect(blockUI.reset).toHaveBeenCalled();
                expect($ctrl.saving).toBeFalsy();
                done();
            });
            $timeout.flush();
            scope.$digest();
        });
    });
});
