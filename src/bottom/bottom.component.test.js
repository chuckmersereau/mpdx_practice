import component from './bottom.component';

export default angular.module('mpdx.bottom', [
    component
]).name;

describe('Bottom Component', () => {
    beforeEach(angular.mock.module('mpdx.bottom'));

    let element;
    let scope;

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new();
        element = angular.element('<bottom></bottom>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    it('should render the text', () => {
        const span = element.find('span');
        expect(span.text()).toBe("© 2012 – " + new Date().getFullYear() + ", Cru. All Rights Reserved.");
    });

    describe('with $componentController', () => {
        let controller;
        let scope;

        beforeEach(inject(($rootScope, $componentController) => {
            scope = $rootScope.$new();
            controller = $componentController('bottom', {$scope: scope});
        }));

        it('should be attached to the scope', () => {
            expect(scope.$ctrl).toBe(controller);
        });

        it('should set the year', () => {
            expect(controller.year).toBe(new Date().getFullYear());
        });
    });
});
