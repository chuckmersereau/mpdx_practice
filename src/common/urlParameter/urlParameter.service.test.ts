import service from './urlParameter.service';

describe('common.urlParameter.service', () => {
    let urlParameter, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _urlParameter_) => {
            rootScope = $rootScope;
            urlParameter = _urlParameter_;
        });
    });
    xit('should do something', () => {
        expect(urlParameter).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
