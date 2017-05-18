import exportContacts from './exportContacts.controller';
import assign from 'lodash/fp/assign';

let contactList = [];
const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};
const params = {
    data: {
        filter: {any_tags: false}
    },
    doDeSerialization: false,
    overrideGetAsPost: true
};

describe('contacts.list.exportContacts.controller', () => {
    let $ctrl, controller, contacts, api, scope, blockUI;
    beforeEach(() => {
        angular.mock.module(exportContacts);
        inject(($controller, $timeout, $rootScope, _contacts_, _api_, _blockUI_, $q) => {
            scope = $rootScope.$new();
            api = _api_;
            contacts = _contacts_;
            blockUI = _blockUI_;
            controller = $controller;
            $ctrl = loadController(contactList);
            spyOn($ctrl, 'blockUI').and.callFake(() => fakeBlockUI);
            spyOn(api, 'get').and.callFake(() => $q.resolve(null));
            spyOn($ctrl.blockUI, 'reset').and.callThrough();
            spyOn($ctrl.blockUI, 'start').and.callThrough();
        });
    });
    function loadController(contacts) {
        return controller('exportContactsController as $ctrl', {
            $scope: scope,
            selectedContactIds: contacts
        });
    }
    describe('constructor', () => {
        it('should set default params', () => {
            expect($ctrl.params).toEqual(params);
        });
    });
    describe('primaryCSVLink', () => {
        beforeEach(() => {
            spyOn($ctrl, 'sendDownload').and.callFake(() => {});
        });
        it('should start the loader', () => {
            $ctrl.primaryCSVLink();
            expect($ctrl.blockUI.start).toHaveBeenCalled();
        });
        it('should query the api', () => {
            $ctrl.primaryCSVLink();
            expect(api.get).toHaveBeenCalledWith(assign(params, {
                url: 'contacts/exports.csv',
                headers: {
                    Accept: 'text/csv'
                }
            }));
        });
        xit('should save the query', (done) => {
            $ctrl.primaryCSVLink().then(() => {
                expect($ctrl.sendDownload).toHaveBeenCalledWith(jasmine.any(Blob), jasmine.any(String));
                done();
            });
        });
        xit('should stop the loader', (done) => {
            $ctrl.primaryCSVLink().finally(() => {
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
        });
    });
    describe('primaryXLSXLink', () => {
        beforeEach(() => {
            spyOn($ctrl, 'sendDownload').and.callFake(() => {});
        });
        it('should start the loader', () => {
            $ctrl.primaryXLSXLink();
            expect($ctrl.blockUI.start).toHaveBeenCalled();
        });
        it('should query the api', () => {
            $ctrl.primaryXLSXLink();
            expect(api.get).toHaveBeenCalledWith(assign(params, {
                url: 'contacts/exports.xlsx',
                headers: {
                    Accept: 'application/xlsx'
                },
                responseType: 'arraybuffer'
            }));
        });
        xit('should save the query', (done) => {
            $ctrl.primaryXLSXLink().then(() => {
                expect($ctrl.sendDownload).toHaveBeenCalledWith(jasmine.any(Blob), jasmine.any(String));
                done();
            });
        });
        xit('should stop the loader', (done) => {
            $ctrl.primaryXLSXLink().then(() => {
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
        });
    });
    describe('mailingCSVLink', () => {
        beforeEach(() => {
            spyOn($ctrl, 'sendDownload').and.callFake(() => {});
        });
        it('should start the loader', () => {
            $ctrl.mailingCSVLink();
            expect($ctrl.blockUI.start).toHaveBeenCalled();
        });
        it('should query the api', () => {
            $ctrl.mailingCSVLink();
            expect(api.get).toHaveBeenCalledWith(assign(params, {
                url: 'contacts/exports/mailing.csv',
                headers: {
                    Accept: 'text/csv'
                }
            }));
        });
        xit('should save the query', (done) => {
            $ctrl.mailingCSVLink().then(() => {
                expect($ctrl.sendDownload).toHaveBeenCalledWith(jasmine.any(Blob), jasmine.any(String));
                done();
            });
        });
        xit('should stop the loader', (done) => {
            $ctrl.mailingCSVLink().then(() => {
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
        });
    });
});