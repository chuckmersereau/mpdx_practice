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
    let $ctrl, componentController, scope, blockUI;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope) => {
            componentController = $componentController;
            scope = $rootScope.$new();
            loadController();
        });
        blockUI = $ctrl.blockUI;
    });

    function loadController(bindings = defaultBindings) {
        $ctrl = componentController('modal', { $scope: scope, $element: {}, $attrs: {} }, bindings);
    }
    describe('deleteAndBlock', () => {
        beforeEach(() => {
            spyOn(blockUI, 'start').and.callFake(() => {});
            spyOn(blockUI, 'reset').and.callFake(() => {});
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
        it('should reset the blockUI', done => {
            spyOn($ctrl, 'save').and.callFake(() => Promise.resolve());
            $ctrl.deleteAndBlock().then(() => {
                expect(blockUI.reset).toHaveBeenCalled();
                done();
            });
        });
        it('should reset the blockUI on reject', done => {
            spyOn($ctrl, 'save').and.callFake(() => Promise.reject(Error('')));
            $ctrl.deleteAndBlock().then(() => {
                expect(blockUI.reset).toHaveBeenCalled();
                done();
            });
        });
    });
    describe('saveAndBlock', () => {
        beforeEach(() => {
            spyOn(blockUI, 'start').and.callFake(() => {});
            spyOn(blockUI, 'reset').and.callFake(() => {});
        });
        it('should block the UI', () => {
            $ctrl.saveAndBlock();
            expect(blockUI.start).toHaveBeenCalled();
        });
        it('should call save', () => {
            spyOn($ctrl, 'save').and.callFake(() => Promise.resolve());
            $ctrl.saveAndBlock();
            expect($ctrl.save).toHaveBeenCalled();
        });
        it('should reset the blockUI', done => {
            spyOn($ctrl, 'save').and.callFake(() => Promise.resolve());
            $ctrl.saveAndBlock().then(() => {
                expect(blockUI.reset).toHaveBeenCalled();
                done();
            });
        });
        it('should reset the blockUI on reject', done => {
            spyOn($ctrl, 'save').and.callFake(() => Promise.reject(Error('')));
            $ctrl.saveAndBlock().then(() => {
                expect(blockUI.reset).toHaveBeenCalled();
                done();
            });
        });
    });
});
