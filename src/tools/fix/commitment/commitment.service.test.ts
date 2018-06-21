import service from './commitment.service';

const accountListId = 123;
let apiData: any = [{
    pledge_amount: 5,
    pledge_currency: 'NZD',
    pledge_frequency: 1,
    status: 'Never Contacted',
    suggested_changes: {
        pledge_amount: '50.0',
        pledge_currency: 'USD',
        pledge_frequency: '2',
        status: 'Partner - Financial'
    }
}];
apiData.meta = { page: 1 };

describe('tools.fix.commitmentInfo.service', () => {
    let api, contacts, fixCommitmentInfo, serverConstants, tools, q, rootScope;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _contacts_, _fixCommitmentInfo_, _serverConstants_, _tools_, $q) => {
            api = _api_;
            contacts = _contacts_;
            fixCommitmentInfo = _fixCommitmentInfo_;
            serverConstants = _serverConstants_;
            tools = _tools_;
            q = $q;
            rootScope = $rootScope;
            api.account_list_id = accountListId;
            serverConstants.data = {
                pledge_frequency_hashes: [{
                    'id': 'Weekly',
                    'key': 0.23076923076923,
                    'value': 'Weekly'
                }, {
                    'id': 'Every 2 Weeks',
                    'key': 0.46153846153846,
                    'value': 'Every 2 Weeks'
                }, {
                    'id': 'Monthly',
                    'key': 1,
                    'value': 'Monthly'
                }, {
                    'id': 'Every 2 Months',
                    'key': 2,
                    'value': 'Every 2 Months'
                }, {
                    'id': 'Quarterly',
                    'key': 3,
                    'value': 'Quarterly'
                }, {
                    'id': 'Every 4 Months',
                    'key': 4,
                    'value': 'Every 4 Months'
                }, {
                    'id': 'Every 6 Months',
                    'key': 6,
                    'value': 'Every 6 Months'
                }, {
                    'id': 'Annual',
                    'key': 12,
                    'value': 'Annual'
                }, {
                    'id': 'Every 2 Years',
                    'key': 24,
                    'value': 'Every 2 Years'
                }]
            };
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(fixCommitmentInfo.loading).toBeFalsy();
            expect(fixCommitmentInfo.page).toEqual(1);
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve(apiData));
            spyOn(fixCommitmentInfo, 'mutateContacts').and.callThrough();
            spyOn(serverConstants, 'getPledgeFrequencyValue').and.callFake(() => 'a');
        });

        it('should return a promise', () => {
            expect(fixCommitmentInfo.load()).toEqual(jasmine.any(q));
        });

        it('should set loading to true', () => {
            expect(fixCommitmentInfo.loading).toBeFalsy();
            fixCommitmentInfo.load();
            expect(fixCommitmentInfo.loading).toBeTruthy();
        });

        it('should call the api', () => {
            fixCommitmentInfo.load();
            expect(api.get).toHaveBeenCalledWith(
                'contacts',
                {
                    filter: {
                        status_valid: false,
                        account_list_id: api.account_list_id,
                        deceased: false
                    },
                    fields: {
                        contact: 'status,pledge_currency,pledge_frequency,pledge_amount,name,avatar,suggested_changes,last_six_donations'
                    },
                    include: 'last_six_donations',
                    sort: 'name',
                    page: 1,
                    per_page: 5
                });
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                fixCommitmentInfo.loading = true;
                fixCommitmentInfo.load().then(() => {
                    expect(fixCommitmentInfo.loading).toBeFalsy();
                    done();
                });
                rootScope.$digest();
            });

            it('should call set meta', (done) => {
                spyOn(fixCommitmentInfo, 'setMeta').and.callThrough();
                fixCommitmentInfo.load().then(() => {
                    expect(fixCommitmentInfo.setMeta).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });

            it('should mutate contact data', (done) => {
                fixCommitmentInfo.load().then(() => {
                    expect(fixCommitmentInfo.mutateContacts).toHaveBeenCalledWith(apiData);
                    done();
                });
                rootScope.$digest();
            });

            it('should store meta', (done) => {
                fixCommitmentInfo.load().then(() => {
                    expect(fixCommitmentInfo.meta).toEqual(apiData.meta);
                    done();
                });
                rootScope.$digest();
            });

            describe('data set', () => {
                beforeEach(() => {
                    fixCommitmentInfo.data = apiData;
                    fixCommitmentInfo.page = 1;
                });

                describe('reset set to true', () => {
                    it('should call the api', (done) => {
                        fixCommitmentInfo.load(true).then(() => {
                            expect(api.get).toHaveBeenCalled();
                            done();
                        });
                        rootScope.$digest();
                    });
                });

                describe('reset set to false', () => {
                    describe('page is current page', () => {
                        it('should not call the api', (done) => {
                            fixCommitmentInfo.load(false, 1).then(() => {
                                expect(api.get).not.toHaveBeenCalled();
                                done();
                            });
                            rootScope.$digest();
                        });

                        it('should return set data', (done) => {
                            fixCommitmentInfo.load(false, 1).then((data) => {
                                expect(data).toEqual(fixCommitmentInfo.data);
                                done();
                            });
                            rootScope.$digest();
                        });

                        it('should return a promise', () => {
                            expect(fixCommitmentInfo.load(false, 1)).toEqual(jasmine.any(q));
                        });
                    });

                    describe('page is not current page', () => {
                        it('should call the api', (done) => {
                            fixCommitmentInfo.load(false, 2).then(() => {
                                expect(api.get).toHaveBeenCalled();
                                done();
                            });
                            rootScope.$digest();
                        });

                        it('should set page', (done) => {
                            expect(fixCommitmentInfo.page).toEqual(1);
                            fixCommitmentInfo.load(false, 2).then(() => {
                                expect(fixCommitmentInfo.page).toEqual(2);
                                done();
                            });
                            rootScope.$digest();
                        });
                    });
                });
            });
        });
    });

    describe('mutateContacts', () => {
        it('should store data', () => {
            spyOn(serverConstants, 'getPledgeFrequencyValue').and.callFake(() => 'Monthly');
            const data = fixCommitmentInfo.mutateContacts(apiData);
            expect(data[0].original_pledge_amount).toEqual(apiData[0].pledge_amount);
            expect(data[0].original_pledge_currency).toEqual(apiData[0].pledge_currency);
            expect(data[0].original_pledge_frequency).toEqual('Monthly');
            expect(data[0].original_status).toEqual(apiData[0].status);
            expect(data[0].pledge_amount).toEqual(50.0);
            expect(data[0].pledge_currency).toEqual(apiData[0].suggested_changes.pledge_currency);
            expect(data[0].pledge_frequency).toEqual(parseInt(apiData[0].suggested_changes.pledge_frequency));
            expect(data[0].status).toEqual(apiData[0].suggested_changes.status);
        });
    });

    describe('setMeta', () => {
        it('should set meta', () => {
            fixCommitmentInfo.setMeta(['data']);
            expect(fixCommitmentInfo.meta).toEqual(['data']);
        });

        it('should set tools.analytics', () => {
            fixCommitmentInfo.setMeta({ pagination: { total_count: 123 } });
            expect(tools.analytics['fix-commitment-info']).toEqual(123);
        });
    });

    describe('save', () => {
        let contact;

        beforeEach(() => {
            contact = { id: 'contact_id', other_field: 'test' };
            spyOn(contacts, 'save').and.callFake(() => q.resolve());
        });

        it('should return a promise', () => {
            expect(fixCommitmentInfo.save(contact)).toEqual(jasmine.any(q));
        });

        it('should call the contacts service', () => {
            fixCommitmentInfo.save(contact);
            expect(contacts.save).toHaveBeenCalledWith(
                {
                    id: 'contact_id',
                    other_field: 'test',
                    status_valid: true
                });
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(fixCommitmentInfo, 'removeContactFromData').and.callFake(() => {});
            });

            it('should call load', (done) => {
                fixCommitmentInfo.save(contact).then(() => {
                    expect(fixCommitmentInfo.removeContactFromData).toHaveBeenCalledWith('contact_id');
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('reject', () => {
        let contact;

        beforeEach(() => {
            contact = { id: 'contact_id', other_field: 'test' };
            spyOn(contacts, 'save').and.callFake(() => q.resolve());
        });

        it('should return a promise', () => {
            expect(fixCommitmentInfo.reject(contact)).toEqual(jasmine.any(q));
        });

        it('should call the contacts service', () => {
            fixCommitmentInfo.reject(contact);
            expect(contacts.save).toHaveBeenCalledWith(
                {
                    id: 'contact_id',
                    status_valid: true
                });
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(fixCommitmentInfo, 'removeContactFromData').and.callFake(() => {});
            });

            it('should call load', (done) => {
                fixCommitmentInfo.reject(contact).then(() => {
                    expect(fixCommitmentInfo.removeContactFromData).toHaveBeenCalledWith('contact_id');
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('removeContactFromData', () => {
        let contact;

        beforeEach(() => {
            fixCommitmentInfo.data = [{ id: 'contact_id' }];
            fixCommitmentInfo.page = 1;
            fixCommitmentInfo.meta = { pagination: { total_count: 2 } };
            contact = fixCommitmentInfo.data[0];
        });

        it('should remove contact from data', () => {
            fixCommitmentInfo.removeContactFromData(contact.id);
            expect(fixCommitmentInfo.data).toEqual([]);
        });

        it('should subtract 1 from the total_count', () => {
            fixCommitmentInfo.removeContactFromData(contact.id);
            expect(fixCommitmentInfo.meta.pagination.total_count).toEqual(1);
        });

        it('should call setMeta', () => {
            spyOn(fixCommitmentInfo, 'setMeta').and.callThrough();
            fixCommitmentInfo.removeContactFromData(contact.id);
            expect(fixCommitmentInfo.setMeta).toHaveBeenCalled();
        });

        describe('data empty', () => {
            beforeEach(() => {
                spyOn(fixCommitmentInfo, 'load').and.callFake(() => q.resolve());
            });

            it('should call load', () => {
                fixCommitmentInfo.removeContactFromData(contact.id);
                expect(fixCommitmentInfo.load).toHaveBeenCalledWith(true, 1);
            });
        });

        describe('data not empty', () => {
            beforeEach(() => {
                spyOn(fixCommitmentInfo, 'load').and.callFake(() => q.resolve());
                fixCommitmentInfo.data.push({ id: 'contact_id_1' });
            });

            it('should not call load', () => {
                fixCommitmentInfo.removeContactFromData(contact.id);
                expect(fixCommitmentInfo.load).not.toHaveBeenCalled();
            });
        });
    });

    describe('bulkSave', () => {
        beforeEach(() => {
            fixCommitmentInfo.data = [{
                id: 'contact_id_0'
            }, {
                id: 'contact_id_1'
            }];
            spyOn(contacts, 'bulkSave').and.callFake(() => q.resolve());
        });

        it('should return a promise', () => {
            expect(fixCommitmentInfo.bulkSave('MPDX')).toEqual(jasmine.any(q));
        });

        it('should call the contacts service', () => {
            fixCommitmentInfo.bulkSave();
            expect(contacts.bulkSave).toHaveBeenCalledWith(
                [{
                    id: 'contact_id_0',
                    status_valid: true
                }, {
                    id: 'contact_id_1',
                    status_valid: true
                }]
            );
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(fixCommitmentInfo, 'load').and.callFake(() => q.resolve());
            });

            it('should call load', (done) => {
                fixCommitmentInfo.bulkSave().then(() => {
                    expect(fixCommitmentInfo.load).toHaveBeenCalledWith(true);
                    done();
                });
                rootScope.$digest();
            });
        });
    });
});
