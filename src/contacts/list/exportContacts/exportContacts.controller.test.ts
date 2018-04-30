import cntrl from './exportContacts.controller';
import { assign } from 'lodash/fp';

let contactList = [];
const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};
const params = {
    data: {
        filter: { any_tags: false }
    },
    doDeSerialization: false,
    overrideGetAsPost: true
};

describe('contacts.list.exportContacts.controller', () => {
    let $ctrl, controller, api, scope, exportContacts, q, blockUI;
    beforeEach(() => {
        angular.mock.module(cntrl);
        inject(($controller, $timeout, $rootScope, _contacts_, _api_, _exportContacts_, $q, _blockUI_) => {
            scope = $rootScope.$new();
            api = _api_;
            blockUI = _blockUI_;
            exportContacts = _exportContacts_;
            q = $q;
            controller = $controller;
            $ctrl = loadController(contactList);
            spyOn($ctrl, 'blockUI').and.callFake(() => fakeBlockUI);
            spyOn(api, 'get').and.callFake(() => q.resolve(null));
            spyOn($ctrl.blockUI, 'reset').and.callThrough();
            spyOn($ctrl.blockUI, 'start').and.callThrough();
        });
    });

    function loadController(contacts) {
        return controller('exportContactsController as $ctrl', {
            $scope: scope,
            selectedContactIds: contacts,
            filter: null
        });
    }
    describe('constructor', () => {
        it('should set default params', () => {
            expect($ctrl.params).toEqual(params);
        });
    });
    describe('primaryCSVLink', () => {
        beforeEach(() => {
            spyOn(exportContacts, 'primaryCSVLink').and.callFake(() => q.resolve());
        });
        it('should start the loader', () => {
            $ctrl.primaryCSVLink();
            expect($ctrl.blockUI.start).toHaveBeenCalled();
        });
        it('should use the service method', () => {
            $ctrl.primaryCSVLink();
            expect(exportContacts.primaryCSVLink).toHaveBeenCalledWith(params);
        });
        it('should stop the loader', (done) => {
            $ctrl.primaryCSVLink().then(() => {
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
    });
    describe('primaryXLSXLink', () => {
        beforeEach(() => {
            spyOn(exportContacts, 'sendDownload').and.callFake(() => q.resolve());
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
        it('should save the query', (done) => {
            $ctrl.primaryXLSXLink().then(() => {
                expect(exportContacts.sendDownload).toHaveBeenCalledWith(jasmine.any(Blob), jasmine.any(String));
                done();
            });
            scope.$digest();
        });
        it('should stop the loader', (done) => {
            $ctrl.primaryXLSXLink().then(() => {
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
    });
    describe('mailingCSVLink', () => {
        beforeEach(() => {
            spyOn(exportContacts, 'sendDownload').and.callFake(() => q.resolve());
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
        it('should save the query', (done) => {
            $ctrl.mailingCSVLink().then(() => {
                expect(exportContacts.sendDownload).toHaveBeenCalledWith(jasmine.any(Blob), jasmine.any(String));
                done();
            });
            scope.$digest();
        });
        it('should stop the loader', (done) => {
            $ctrl.mailingCSVLink().then(() => {
                expect($ctrl.blockUI.reset).toHaveBeenCalled();
                done();
            });
            scope.$digest();
        });
    });
});