import service from './commitmentInfo.service';

const accountListId = 123;

describe('tools.fix.commitmentInfo.service', () => {
    let api, contacts, fixCommitmentInfo;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _contacts_, _fixCommitmentInfo_) => {
            api = _api_;
            contacts = _contacts_;
            fixCommitmentInfo = _fixCommitmentInfo_;
            api.account_list_id = accountListId;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(fixCommitmentInfo.loading).toBeFalsy();
            expect(fixCommitmentInfo.page).toEqual(1);
        });
    });

    describe('loadCount', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({ meta: { page: 0 } }));
        });

        it('should return a promise', () => {
            expect(fixCommitmentInfo.loadCount()).toEqual(jasmine.any(Promise));
        });

        describe('meta set', () => {
            beforeEach(() => {
                fixCommitmentInfo.meta = { page: 1 };
            });

            it('should return meta', (done) => {
                fixCommitmentInfo.loadCount().then((data) => {
                    expect(data).toEqual(fixCommitmentInfo.meta);
                    done();
                });
            });

            it('should not call the api', (done) => {
                fixCommitmentInfo.loadCount().then(() => {
                    expect(api.get).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('meta not set', () => {
            it('should set and return meta', (done) => {
                fixCommitmentInfo.loadCount().then((data) => {
                    expect(data).toEqual(fixCommitmentInfo.meta);
                    done();
                });
            });

            it('should call the api', (done) => {
                fixCommitmentInfo.loadCount().then(() => {
                    expect(api.get).toHaveBeenCalledWith(
                        'contacts',
                        {
                            filter: {
                                status_valid: false,
                                account_list_id: api.account_list_id
                            },
                            page: 1,
                            per_page: 0
                        });
                    done();
                });
            });
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(apiData));
        });

        it('should return a promise', () => {
            expect(fixCommitmentInfo.load()).toEqual(jasmine.any(Promise));
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
                        account_list_id: api.account_list_id
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
            });

            it('should store data', (done) => {
                fixCommitmentInfo.load().then((data) => {
                    expect(data).toEqual(apiData);
                    done();
                });
            });

            it('should store meta', (done) => {
                fixCommitmentInfo.load().then((data) => {
                    expect(data.meta).toEqual(apiData.meta);
                    done();
                });
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
                    });
                });

                describe('reset set to false', () => {
                    describe('page is current page', () => {
                        it('should not call the api', (done) => {
                            fixCommitmentInfo.load(false, 1).then(() => {
                                expect(api.get).not.toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should return set data', (done) => {
                            fixCommitmentInfo.load(false, 1).then((data) => {
                                expect(data).toEqual(fixCommitmentInfo.data);
                                done();
                            });
                        });

                        it('should return a promise', () => {
                            expect(fixCommitmentInfo.load(false, 1)).toEqual(jasmine.any(Promise));
                        });
                    });

                    describe('page is not current page', () => {
                        it('should call the api', (done) => {
                            fixCommitmentInfo.load(false, 2).then(() => {
                                expect(api.get).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should set page', (done) => {
                            expect(fixCommitmentInfo.page).toEqual(1);
                            fixCommitmentInfo.load(false, 2).then(() => {
                                expect(fixCommitmentInfo.page).toEqual(2);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('save', () => {
        let contact;

        beforeEach(() => {
            contact = { id: 'contact_id', other_field: 'test' };
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixCommitmentInfo.save(contact)).toEqual(jasmine.any(Promise));
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
                spyOn(fixCommitmentInfo, 'removeContactFromData').and.returnValue();
            });

            it('should call load', (done) => {
                fixCommitmentInfo.save(contact).then(() => {
                    expect(fixCommitmentInfo.removeContactFromData).toHaveBeenCalledWith('contact_id');
                    done();
                });
            });
        });
    });

    describe('reject', () => {
        let contact;

        beforeEach(() => {
            contact = { id: 'contact_id', other_field: 'test' };
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixCommitmentInfo.reject(contact)).toEqual(jasmine.any(Promise));
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
                spyOn(fixCommitmentInfo, 'removeContactFromData').and.returnValue();
            });

            it('should call load', (done) => {
                fixCommitmentInfo.reject(contact).then(() => {
                    expect(fixCommitmentInfo.removeContactFromData).toHaveBeenCalledWith('contact_id');
                    done();
                });
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

        describe('data empty', () => {
            beforeEach(() => {
                spyOn(fixCommitmentInfo, 'load').and.callFake(() => Promise.resolve());
            });

            it('should call load', () => {
                fixCommitmentInfo.removeContactFromData(contact.id);
                expect(fixCommitmentInfo.load).toHaveBeenCalledWith(true, 1);
            });
        });

        describe('data not empty', () => {
            beforeEach(() => {
                spyOn(fixCommitmentInfo, 'load').and.callFake(() => Promise.resolve());
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
            spyOn(contacts, 'bulkSave').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixCommitmentInfo.bulkSave('MPDX')).toEqual(jasmine.any(Promise));
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
                spyOn(fixCommitmentInfo, 'load').and.callFake(() => Promise.resolve());
            });

            it('should call load', (done) => {
                fixCommitmentInfo.bulkSave().then(() => {
                    expect(fixCommitmentInfo.load).toHaveBeenCalledWith(true);
                    done();
                });
            });
        });
    });

    const apiData = [
        {
            pledge_amount: 5,
            pledge_currency: 'NZD',
            pledge_frequency: 1,
            status: 'Never Contacted',
            suggested_changes: {
                pledge_amount: '50.0',
                pledge_currency: 'USD',
                pledge_frequency: 2,
                status: 'Partner - Financial'
            }
        }
    ];

    apiData.meta = { page: 1 };
});
