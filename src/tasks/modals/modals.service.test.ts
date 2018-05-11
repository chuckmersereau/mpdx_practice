import service from './modals.service';

describe('common.tasksModals.service', () => {
    let tasksModals, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _tasksModals_) => {
            rootScope = $rootScope;
            tasksModals = _tasksModals_;
        });
    });

    xit('should do something', () => {
        expect(tasksModals).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
