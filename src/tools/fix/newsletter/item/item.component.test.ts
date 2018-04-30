import component from './item.component';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('tools.fix.sendNewsletter.item.component', () => {
    let $ctrl, rootScope, scope, componentController, blockUI, fixSendNewsletter, contact, q;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, _blockUI_, _fixSendNewsletter_, $q) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            blockUI = _blockUI_;
            fixSendNewsletter = _fixSendNewsletter_;
            q = $q;
            componentController = $componentController;
            contact = { id: 'contact_id' };
            loadController();
        });
    });

    function loadController() {
        spyOn(blockUI.instances, 'get').and.callFake(() => fakeBlockUI);
        $ctrl = componentController('fixSendNewsletterItem', { $scope: scope }, { contact: contact });
        spyOn($ctrl.blockUI, 'start').and.callThrough();
        spyOn($ctrl.blockUI, 'reset').and.callThrough();
    }

    describe('$onInit', () => {
        it('should get instance of blockUI', () => {
            $ctrl.$onInit();
            expect(blockUI.instances.get).toHaveBeenCalledWith('fix-send-newsletter-item-contact_id');
            expect($ctrl.blockUI).toEqual(fakeBlockUI);
        });
    });

    describe('save', () => {
        beforeEach(() => {
            spyOn(fixSendNewsletter, 'save').and.callFake(() => q.resolve());
        });

        it('should call save', (done) => {
            $ctrl.save().then(() => {
                expect(fixSendNewsletter.save).toHaveBeenCalledWith(contact);
                done();
            });
            scope.$digest();
        });

        it('should have toggled blockUI', (done) => {
            $ctrl.save().then(() => {
                expect($ctrl.blockUI.start).toHaveBeenCalled();
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
    });
});
