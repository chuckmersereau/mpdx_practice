import cntrl from './export.controller';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

describe('home.care.newsletter.export.controller', () => {
    let $ctrl, scope, controller, contacts;

    beforeEach(() => {
        angular.mock.module(cntrl);
        inject(($controller, $timeout, $rootScope, _contacts_) => {
            scope = $rootScope.$new();
            contacts = _contacts_;
            controller = $controller;
            $ctrl = loadController();
            spyOn($ctrl, 'blockUI').and.callFake(() => fakeBlockUI);
            spyOn($ctrl.alerts, 'addAlert').and.callFake(() => {});
            spyOn($ctrl, 'gettext').and.callFake((data) => data);

            spyOn($ctrl.blockUI, 'reset').and.callThrough();
            spyOn($ctrl.blockUI, 'start').and.callThrough();
        });
    });

    function loadController() {
        return controller('exportContactEmailsController as $ctrl', {
            $scope: scope,
            filter: {}
        });
    }

    describe('getEmails', () => {
        beforeEach(() => {
            $ctrl.filter = {};
        });
        describe('success', () => {
            beforeEach(() => {
                spyOn(contacts, 'getEmails').and.callFake(() => Promise.resolve('a'));
            });
            it('should call the api', () => {
                $ctrl.getEmails();
                expect(contacts.getEmails).toHaveBeenCalledWith();
            });
            it('should map data to emails', (done) => {
                $ctrl.getEmails().then(() => {
                    expect($ctrl.emails).toEqual('a');
                    done();
                });
            });
            it('should reset blockUI', (done) => {
                $ctrl.getEmails().then(() => {
                    expect($ctrl.blockUI.reset).toHaveBeenCalledWith();
                    done();
                });
            });
        });
        describe('failed api', () => {
            beforeEach(() => {
                spyOn(contacts, 'getEmails').and.callFake(() => Promise.reject());
            });
            it('should alert the user', (done) => {
                $ctrl.getEmails().catch(() => {
                    expect($ctrl.gettext).toHaveBeenCalledWith('Unable to retrieve contacts. Please try again.');
                    expect($ctrl.alerts.addAlert).toHaveBeenCalledWith('Unable to retrieve contacts. Please try again.', 'danger');
                    done();
                });
            });
            it('should reset blockUI', (done) => {
                $ctrl.getEmails().catch(() => {
                    expect($ctrl.blockUI.reset).toHaveBeenCalledWith();
                    done();
                });
            });
        });
    });

});