import component from './news.component';

describe('menu.news.component', () => {
    let session, $$window, $ctrl, scope;
    beforeEach(() => {
        angular.mock.module(component);
        inject(($componentController, $rootScope, $window, _session_) => {
            scope = $rootScope.$new();
            session = _session_;
            $$window = $window;
            $ctrl = $componentController('newsBanner', { $scope: scope });
        });
    });

    describe('close', () => {
        beforeEach(() => {
            spyOn($$window.localStorage, 'setItem').and.callFake(() => {});
        });

        it('should set localStorage', () => {
            $ctrl.close();
            expect($$window.localStorage.setItem).toHaveBeenCalledWith('useNext', false);
        });

        it('should set hasNews', () => {
            $ctrl.close();
            expect(session.hasNews).toBeFalsy();
        });
    });

    // cannot test location.href calls
    xdescribe('go', () => {
        beforeEach(() => {
            spyOn($$window.localStorage, 'setItem').and.callFake(() => {});
        });

        it('should set localStorage', () => {
            $ctrl.go();
            expect($$window.localStorage.setItem).toHaveBeenCalledWith('useNext', true);
        });

        it('should set hasNews', () => {
            $ctrl.go();
            expect($$window.location.href).toEqual('https://next.mpdx.org');
        });
    });
});