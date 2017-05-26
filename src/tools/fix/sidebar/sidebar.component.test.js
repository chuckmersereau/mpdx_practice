import component from './sidebar.component';

describe('tools.fix.sidebar.component', () => {
    let $ctrl, rootScope, scope, componentController,
        fixAddresses, fixCommitmentInfo, fixEmailAddresses, fixPhoneNumbers;

    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope,
        _fixAddresses_, _fixCommitmentInfo_, _fixEmailAddresses_, _fixPhoneNumbers_) => {
            rootScope = $rootScope;
            scope = rootScope.$new();
            fixAddresses = _fixAddresses_;
            fixCommitmentInfo = _fixCommitmentInfo_;
            fixEmailAddresses = _fixEmailAddresses_;
            fixPhoneNumbers = _fixPhoneNumbers_;
            componentController = $componentController;
            loadController();
        });
    });

    function loadController() {
        $ctrl = componentController('fixSidebar', { $scope: scope });
    }

    describe('$onInit', () => {
        beforeEach(() => {
            spyOn(fixAddresses, 'loadCount').and.returnValue();
            spyOn(fixCommitmentInfo, 'loadCount').and.returnValue();
            spyOn(fixEmailAddresses, 'loadCount').and.returnValue();
            spyOn(fixPhoneNumbers, 'loadCount').and.returnValue();
        });

        describe('current state name is not set', () => {
            beforeEach(() => {
                $ctrl.$onInit();
            });

            it('should not call fixAddresses', () => {
                expect(fixAddresses.loadCount).toHaveBeenCalled();
            });

            it('should call fixCommitmentInfo', () => {
                expect(fixCommitmentInfo.loadCount).toHaveBeenCalled();
            });

            it('should call fixEmailAddresses', () => {
                expect(fixEmailAddresses.loadCount).toHaveBeenCalled();
            });

            it('should call fixPhoneNumbers', () => {
                expect(fixPhoneNumbers.loadCount).toHaveBeenCalled();
            });
        });

        describe('current state name is tools.fix.addresses', () => {
            beforeEach(() => {
                $ctrl.$state = { current: { name: 'tools.fix.addresses' } };
                $ctrl.$onInit();
            });

            it('should not call fixAddresses', () => {
                expect(fixAddresses.loadCount).not.toHaveBeenCalled();
            });
        });

        describe('current state name is tools.fix.commitmentInfo', () => {
            beforeEach(() => {
                $ctrl.$state = { current: { name: 'tools.fix.commitmentInfo' } };
                $ctrl.$onInit();
            });

            it('should not call fixCommitmentInfo', () => {
                expect(fixCommitmentInfo.loadCount).not.toHaveBeenCalled();
            });
        });

        describe('current state name is tools.fix.emailAddresses', () => {
            beforeEach(() => {
                $ctrl.$state = { current: { name: 'tools.fix.emailAddresses' } };
                $ctrl.$onInit();
            });

            it('should not call fixEmailAddresses', () => {
                expect(fixEmailAddresses.loadCount).not.toHaveBeenCalled();
            });
        });

        describe('current state name is tools.fix.phoneNumbers', () => {
            beforeEach(() => {
                $ctrl.$state = { current: { name: 'tools.fix.phoneNumbers' } };
                $ctrl.$onInit();
            });

            it('should call fixPhoneNumbers', () => {
                expect(fixPhoneNumbers.loadCount).not.toHaveBeenCalled();
            });
        });
    });
});
