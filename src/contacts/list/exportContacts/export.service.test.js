import service from './export.service';
import assign from 'lodash/fp/assign';

const params = {
    data: {
        filter: { any_tags: false }
    },
    doDeSerialization: false,
    overrideGetAsPost: true
};

describe('contacts.list.exportContacts.controller', () => {
    let exportContacts, api;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($timeout, $rootScope, _exportContacts_, _api_) => {
            api = _api_;
            exportContacts = _exportContacts_;
            spyOn(api, 'get').and.callFake(() => Promise.resolve(null));
        });
    });

    describe('primaryCSVLink', () => {
        beforeEach(() => {
            spyOn(exportContacts, 'sendDownload').and.callFake(() => {});
        });
        it('should query the api', () => {
            exportContacts.primaryCSVLink(params);
            expect(api.get).toHaveBeenCalledWith(assign(params, {
                url: 'contacts/exports.csv',
                headers: {
                    Accept: 'text/csv'
                }
            }));
        });
        it('should save the query', (done) => {
            exportContacts.primaryCSVLink(params).then(() => {
                expect(exportContacts.sendDownload).toHaveBeenCalledWith(jasmine.any(Blob), jasmine.any(String));
                done();
            });
        });
    });
});