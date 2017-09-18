import service from './modal.service';

describe('common.modal.service', () => {
    let modal, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _modal_) => {
            rootScope = $rootScope;
            modal = _modal_;
        });
    });
    xit('should do something', () => {
        expect(modal).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
