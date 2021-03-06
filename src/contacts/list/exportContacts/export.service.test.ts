import { assign } from 'lodash/fp';
import service from './export.service';

let filters = {
    any_tags: false
};

describe('contacts.list.exportContacts.service', () => {
    let $$window, exportContacts, q, rootScope, api;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($window, $rootScope, _exportContacts_, _api_, $q) => {
            $$window = $window;
            q = $q;
            api = _api_;
            exportContacts = _exportContacts_;
            rootScope = $rootScope;
        });
    });

    describe('create', () => {
        beforeEach(() => {
            spyOn(api, 'post').and.callFake(() => q.resolve({ id: 'export_id' }));
            spyOn($$window.localStorage, 'getItem').and.returnValue('access_token');
            spyOn($$window.location, 'replace').and.returnValue('');
        });

        it('should call api.post', () => {
            exportContacts.create(filters);
            expect(api.post).toHaveBeenCalledWith({
                url: 'contacts/exports',
                data: {
                    params: {
                        filter: filters
                    }
                },
                type: 'export_logs'
            });
        });

        it('should return promise', () => {
            expect(exportContacts.create(filters)).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should call $window.localStorage.getItem', (done) => {
                exportContacts.create(filters).then(() => {
                    expect($$window.localStorage.getItem).toHaveBeenCalledWith(
                        'token'
                    );
                    done();
                });
                rootScope.$digest();
            });

            it('should call $window.location.replace', (done) => {
                exportContacts.create(filters).then(() => {
                    expect($$window.location.replace).toHaveBeenCalledWith(
                        '/api/v1/contacts/exports/export_id.csv?access_token=access_token'
                    );
                    done();
                });
                rootScope.$digest();
            });

            describe('format xlsx', () => {
                it('should call $window.location.replace', (done) => {
                    exportContacts.create(filters, 'xlsx').then(() => {
                        expect($$window.location.replace).toHaveBeenCalledWith(
                            '/api/v1/contacts/exports/export_id.xlsx?access_token=access_token'
                        );
                        done();
                    });
                    rootScope.$digest();
                });
            });
        });

        describe('Mailing', () => {
            it('should call api.post', () => {
                exportContacts.create(filters, 'csv', true);
                expect(api.post).toHaveBeenCalledWith({
                    url: 'contacts/exports/mailing',
                    data: {
                        params: {
                            filter: filters
                        }
                    },
                    type: 'export_logs'
                });
            });

            describe('promise successful', () => {
                it('should call $window.location.replace', (done) => {
                    exportContacts.create(filters, 'csv', true).then(() => {
                        expect($$window.location.replace).toHaveBeenCalledWith(
                            '/api/v1/contacts/exports/mailing/export_id.csv?access_token=access_token'
                        );
                        done();
                    });
                    rootScope.$digest();
                });

                describe('format xlsx', () => {
                    it('should call $window.location.replace', (done) => {
                        exportContacts.create(filters, 'xlsx', true).then(() => {
                            expect($$window.location.replace).toHaveBeenCalledWith(
                                '/api/v1/contacts/exports/mailing/export_id.xlsx?access_token=access_token'
                            );
                            done();
                        });
                        rootScope.$digest();
                    });
                });
            });
        });
    });
});
