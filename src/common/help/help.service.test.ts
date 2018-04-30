import service from './help.service';

describe('common.help.service', () => {
    let help, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _help_) => {
            rootScope = $rootScope;
            help = _help_;
        });
    });
    xit('should do something', () => {
        expect(help).toEqual(1);
        expect(rootScope).toEqual(1);
    });
});
