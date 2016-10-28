import component from './bottom.component';

describe('Bottom Component', () => {
    let ctrl;

    beforeEach(() => {
        angular.mock.module(component);
        inject((_$componentController_) => {
            ctrl = _$componentController_('bottom');
        });
    });

    it('should render the text', () => {
        expect(ctrl.year).toBe(new Date().getFullYear());
    });
});
