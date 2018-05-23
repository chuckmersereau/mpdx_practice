import service from './selectionStore.service';

describe('common.selectionStore.service', () => {
    let selectionStore, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _selectionStore_) => {
            rootScope = $rootScope;
            selectionStore = _selectionStore_;
        });
    });

    xit('should do something', () => {
        expect(selectionStore).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
