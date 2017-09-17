import service from './reports.service';

describe('reports.service', () => {
    let reports, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _reports_) => {
            rootScope = $rootScope;
            reports = _reports_;
        });
    });
    xit('should do something', () => {
        expect(reports).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
