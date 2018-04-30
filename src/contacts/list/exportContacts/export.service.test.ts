import service from './export.service';
import { assign } from 'lodash/fp';

const params = {
    data: {
        filter: { any_tags: false }
    },
    doDeSerialization: false,
    overrideGetAsPost: true
};

describe('contacts.list.exportContacts.service', () => {
    let exportContacts, api, q, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _exportContacts_, _api_, $q) => {
            api = _api_;
            q = $q;
            exportContacts = _exportContacts_;
            rootScope = $rootScope;
        });
        spyOn(api, 'get').and.callFake(() => q.resolve(null));
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
            rootScope.$digest();
        });
    });
});