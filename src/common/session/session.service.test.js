import service from './session.service';

describe('common.session.service', () => {
    let session;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _session_) => {
            session = _session_;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(session.navSecondary).toBeFalsy();
            expect(session.navSetup).toBeFalsy();
            expect(session.navImpersonation).toBeFalsy();
            expect(session.showFiltersOnMobile).toBeFalsy();
            expect(session.hasNews).toBeFalsy();
        });
    });

    describe('isInState', () => {
        const match = 'tools.fix';

        describe('current route matches all', () => {
            beforeEach(() => {
                session.$state = { $current: { name: 'tools.fix' } };
            });

            it('should return true', () => {
                expect(session.isInState(match)).toBeTruthy();
            });
        });

        describe('current route matches partial', () => {
            beforeEach(() => {
                session.$state = { $current: { name: 'tools.fix.commitmentInfo' } };
            });

            it('should return true', () => {
                expect(session.isInState(match)).toBeTruthy();
            });
        });

        describe('current route matches partial but not intial', () => {
            beforeEach(() => {
                session.$state = { $current: { name: 'contacts.tools.fix.commitmentInfo' } };
            });

            it('should return true', () => {
                expect(session.isInState(match)).toBeFalsy();
            });
        });

        describe('current route does not match', () => {
            beforeEach(() => {
                session.$state = { $current: { name: 'contacts.show' } };
            });

            it('should return true', () => {
                expect(session.isInState(match)).toBeFalsy();
            });
        });
    });
});
