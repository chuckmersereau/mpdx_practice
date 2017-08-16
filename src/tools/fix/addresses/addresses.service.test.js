import service from './addresses.service';

const accountListId = 123;

describe('tools.fix.addresses.service', () => {
    let api, contacts, fixAddresses, tools;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _contacts_, _fixAddresses_, _tools_) => {
            api = _api_;
            contacts = _contacts_;
            fixAddresses = _fixAddresses_;
            tools = _tools_;
            api.account_list_id = accountListId;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(fixAddresses.loading).toBeFalsy();
            expect(fixAddresses.page).toEqual(1);
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(apiData));
        });

        it('should return a promise', () => {
            expect(fixAddresses.load()).toEqual(jasmine.any(Promise));
        });

        it('should set loading to true', () => {
            expect(fixAddresses.loading).toBeFalsy();
            fixAddresses.load();
            expect(fixAddresses.loading).toBeTruthy();
        });

        it('should call the api', () => {
            fixAddresses.load();
            expect(api.get).toHaveBeenCalledWith(
                'contacts',
                {
                    filter: {
                        address_valid: false,
                        account_list_id: api.account_list_id
                    },
                    fields: {
                        contacts: 'name,avatar,addresses'
                    },
                    include: 'addresses',
                    page: 1,
                    per_page: 25,
                    sort: 'name'
                });
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                fixAddresses.loading = true;
                fixAddresses.load().then(() => {
                    expect(fixAddresses.loading).toBeFalsy();
                    done();
                });
            });

            it('should call set meta', (done) => {
                spyOn(fixAddresses, 'setMeta').and.callThrough();
                fixAddresses.load().then(() => {
                    expect(fixAddresses.setMeta).toHaveBeenCalled();
                    done();
                });
            });

            it('should collect list of sources', (done) => {
                fixAddresses.load().then(() => {
                    expect(fixAddresses.sources).toEqual(['Dataserver', 'MPDX', 'Sibel', 'Tntmpd']);
                    done();
                });
            });

            it('should store data', (done) => {
                fixAddresses.load().then((data) => {
                    expect(data).toEqual(apiData);
                    done();
                });
            });

            it('should store meta', (done) => {
                fixAddresses.load().then((data) => {
                    expect(data.meta).toEqual(apiData.meta);
                    done();
                });
            });

            describe('data set', () => {
                beforeEach(() => {
                    fixAddresses.data = apiData;
                    fixAddresses.page = 1;
                });
                describe('reset set to true', () => {
                    it('should call the api', (done) => {
                        fixAddresses.load(true).then(() => {
                            expect(api.get).toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('reset set to false', () => {
                    describe('page is current page', () => {
                        it('should not call the api', (done) => {
                            fixAddresses.load(false, 1).then(() => {
                                expect(api.get).not.toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should return set data', (done) => {
                            fixAddresses.load(false, 1).then((data) => {
                                expect(data).toEqual(fixAddresses.data);
                                done();
                            });
                        });

                        it('should return a promise', () => {
                            expect(fixAddresses.load(false, 1)).toEqual(jasmine.any(Promise));
                        });
                    });

                    describe('page is not current page', () => {
                        it('should call the api', (done) => {
                            fixAddresses.load(false, 2).then(() => {
                                expect(api.get).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should set page', (done) => {
                            expect(fixAddresses.page).toEqual(1);
                            fixAddresses.load(false, 2).then(() => {
                                expect(fixAddresses.page).toEqual(2);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('setMeta', () => {
        it('should set meta', () => {
            fixAddresses.setMeta(['data']);
            expect(fixAddresses.meta).toEqual(['data']);
        });

        it('should set tools.analytics', () => {
            fixAddresses.setMeta({ pagination: { total_count: 123 } });
            expect(tools.analytics['fix-addresses']).toEqual(123);
        });
    });

    describe('save', () => {
        let contact;
        beforeEach(() => {
            fixAddresses.data = [{ id: 'contact_id', addresses: [{}, {}] }];
            fixAddresses.page = 1;
            fixAddresses.meta = { pagination: { total_count: 2 } };
            contact = fixAddresses.data[0];
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixAddresses.save(contact)).toEqual(jasmine.any(Promise));
        });

        it('should call the contacts service', () => {
            fixAddresses.save(contact);
            expect(contacts.save).toHaveBeenCalledWith(
                {
                    id: 'contact_id',
                    addresses: [{ valid_values: true }, { valid_values: true }]
                });
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(fixAddresses, 'load').and.callFake(() => Promise.resolve());
            });

            it('should remove contact from data', (done) => {
                fixAddresses.save(contact).then(() => {
                    expect(fixAddresses.data).toEqual([]);
                    done();
                });
            });

            it('should subtract 1 from the total_count', (done) => {
                fixAddresses.save(contact).then(() => {
                    expect(fixAddresses.meta.pagination.total_count).toEqual(1);
                    done();
                });
            });

            it('should call setMeta', (done) => {
                spyOn(fixAddresses, 'setMeta').and.callThrough();
                fixAddresses.save(contact).then(() => {
                    expect(fixAddresses.setMeta).toHaveBeenCalled();
                    done();
                });
            });

            describe('data empty', () => {
                it('should call load', (done) => {
                    fixAddresses.save(contact).then(() => {
                        expect(fixAddresses.load).toHaveBeenCalledWith(true, 1);
                        done();
                    });
                });
            });

            describe('data not empty', () => {
                beforeEach(() => {
                    fixAddresses.data.push({ id: 'contact_id_1' });
                });

                it('should not call load', (done) => {
                    fixAddresses.save(contact).then(() => {
                        expect(fixAddresses.load).not.toHaveBeenCalled();
                        done();
                    });
                });
            });
        });
    });

    describe('bulkSave', () => {
        beforeEach(() => {
            fixAddresses.data = [{
                id: 'contact_id_0',
                addresses: [
                    {
                        id: 'address_id_0',
                        source: 'Sibel',
                        primary_mailing_address: true
                    }, {
                        id: 'address_id_1',
                        source: 'MPDX',
                        primary_mailing_address: false
                    }, {
                        id: 'address_id_2',
                        source: 'MPDX',
                        primary_mailing_address: false
                    }
                ]
            }, {
                id: 'contact_id_1',
                addresses: [
                    {
                        id: 'address_id_3',
                        source: 'Sibel',
                        primary_mailing_address: true
                    }
                ]
            }];
            spyOn(contacts, 'bulkSave').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixAddresses.bulkSave('MPDX')).toEqual(jasmine.any(Promise));
        });

        it('should call the contacts service', () => {
            fixAddresses.bulkSave('MPDX');
            expect(contacts.bulkSave).toHaveBeenCalledWith(
                [{
                    id: 'contact_id_0',
                    addresses: [
                        {
                            id: 'address_id_0',
                            source: 'Sibel',
                            primary_mailing_address: false,
                            valid_values: true
                        }, {
                            id: 'address_id_1',
                            source: 'MPDX',
                            primary_mailing_address: true,
                            valid_values: true
                        }, {
                            id: 'address_id_2',
                            source: 'MPDX',
                            primary_mailing_address: false,
                            valid_values: true
                        }
                    ]
                }]
            );
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(fixAddresses, 'load').and.callFake(() => Promise.resolve());
            });

            it('should call load', (done) => {
                fixAddresses.bulkSave('MPDX').then(() => {
                    expect(fixAddresses.load).toHaveBeenCalledWith(true);
                    done();
                });
            });
        });
    });

    describe('setPrimary', () => {
        it('should set the primary_mailing_address address as primary_mailing_address in the contact object', () => {
            let contact = { addresses: [
                {
                    id: 'address_0',
                    primary_mailing_address: true
                }, {
                    id: 'address_1',
                    primary_mailing_address: true
                }, {
                    id: 'address_2',
                    primary_mailing_address: false
                }
            ]};
            expect(contact.addresses[2].primary_mailing_address).toBeFalsy();
            fixAddresses.setPrimary(contact, { id: 'address_2' });
            expect(contact.addresses[2].primary_mailing_address).toBeTruthy();
        });
    });

    describe('removeAddress', () => {
        let contact;

        beforeEach(() => {
            contact = {
                id: 'contact_id',
                addresses: [
                    {
                        id: 'address_0',
                        primary_mailing_address: true
                    }, {
                        id: 'address_1',
                        primary_mailing_address: true
                    }, {
                        id: 'address_2',
                        primary_mailing_address: false
                    }]
            };
            spyOn(contacts, 'deleteAddress').and.callFake(() => Promise.resolve());
        });

        it('should call the contacts service', () => {
            fixAddresses.removeAddress(contact, { id: 'address_1' });
            expect(contacts.deleteAddress).toHaveBeenCalledWith(
                'contact_id', 'address_1'
            );
        });

        it('should return a promise', () => {
            expect(fixAddresses.removeAddress(contact, { id: 'address_1' })).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should remove address from contact object', (done) => {
                fixAddresses.removeAddress(contact, { id: 'address_1' }).then(() => {
                    expect(contact).toEqual(
                        {
                            id: 'contact_id',
                            addresses: [
                                {
                                    id: 'address_0',
                                    primary_mailing_address: true
                                }, {
                                    id: 'address_2',
                                    primary_mailing_address: false
                                }
                            ]
                        }
                    );
                    done();
                });
            });
        });
    });

    describe('hasPrimary', () => {
        let contact;

        describe('has single primary', () => {
            beforeEach(() => {
                contact = {
                    id: 'contact_id',
                    addresses: [
                        { primary_mailing_address: true },
                        { primary_mailing_address: false },
                        { primary_mailing_address: false }
                    ]
                };
            });

            it('should return true', () => {
                expect(fixAddresses.hasPrimary(contact)).toBeTruthy();
            });
        });

        describe('has multiple primaries', () => {
            beforeEach(() => {
                contact = {
                    id: 'contact_id',
                    addresses: [
                        { primary_mailing_address: true },
                        { primary_mailing_address: true },
                        { primary_mailing_address: false }
                    ]
                };
            });

            it('should return false', () => {
                expect(fixAddresses.hasPrimary(contact)).toBeFalsy();
            });
        });

        describe('has no primaries', () => {
            beforeEach(() => {
                contact = {
                    id: 'contact_id',
                    addresses: [
                        { primary_mailing_address: false },
                        { primary_mailing_address: false },
                        { primary_mailing_address: false }
                    ]
                };
            });

            it('should return false', () => {
                expect(fixAddresses.hasPrimary(contact)).toBeFalsy();
            });
        });
    });


    const apiData = [
        { addresses: [{ source: 'Sibel' }] },
        { addresses: [{ source: 'Tntmpd' }] },
        { addresses: [{ source: 'Dataserver' }] },
        { addresses: [{ source: 'Dataserver' }] }
    ];

    apiData.meta = { page: 1 };
});
