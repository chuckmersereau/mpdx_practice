import service from './emailAddresses.service';

const accountListId = 123;

describe('tools.fix.emailAddresses.service', () => {
    let api, people, fixEmailAddresses;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _people_, _fixEmailAddresses_) => {
            api = _api_;
            people = _people_;
            fixEmailAddresses = _fixEmailAddresses_;
            api.account_list_id = accountListId;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(fixEmailAddresses.loading).toBeFalsy();
            expect(fixEmailAddresses.page).toEqual(1);
        });
    });

    describe('loadCount', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({ meta: { page: 0 } }));
        });

        it('should return a promise', () => {
            expect(fixEmailAddresses.loadCount()).toEqual(jasmine.any(Promise));
        });

        describe('meta set', () => {
            beforeEach(() => {
                fixEmailAddresses.meta = { page: 1 };
            });

            it('should return meta', (done) => {
                fixEmailAddresses.loadCount().then((data) => {
                    expect(data).toEqual(fixEmailAddresses.meta);
                    done();
                });
            });

            it('should not call the api', (done) => {
                fixEmailAddresses.loadCount().then(() => {
                    expect(api.get).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('meta not set', () => {
            it('should set and return meta', (done) => {
                fixEmailAddresses.loadCount().then((data) => {
                    expect(data).toEqual(fixEmailAddresses.meta);
                    done();
                });
            });

            it('should call the api', (done) => {
                fixEmailAddresses.loadCount().then(() => {
                    expect(api.get).toHaveBeenCalledWith(
                        'contacts/people',
                        {
                            filter: {
                                email_address_valid: false,
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
            expect(fixEmailAddresses.load()).toEqual(jasmine.any(Promise));
        });

        it('should set loading to true', () => {
            expect(fixEmailAddresses.loading).toBeFalsy();
            fixEmailAddresses.load();
            expect(fixEmailAddresses.loading).toBeTruthy();
        });

        it('should call the api', () => {
            fixEmailAddresses.load();
            expect(api.get).toHaveBeenCalledWith(
                'contacts/people',
                {
                    filter: {
                        email_address_valid: false,
                        account_list_id: api.account_list_id
                    },
                    fields: {
                        person: 'first_name,last_name,avatar,email_addresses,parent_contacts'
                    },
                    include: 'email_addresses',
                    page: 1,
                    per_page: 25
                });
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                fixEmailAddresses.loading = true;
                fixEmailAddresses.load().then(() => {
                    expect(fixEmailAddresses.loading).toBeFalsy();
                    done();
                });
            });

            it('should collect list of sources', (done) => {
                fixEmailAddresses.load().then(() => {
                    expect(fixEmailAddresses.sources).toEqual(['Dataserver', 'MPDX', 'Sibel', 'Tntmpd']);
                    done();
                });
            });

            it('should store data', (done) => {
                fixEmailAddresses.load().then((data) => {
                    expect(data).toEqual(apiData);
                    done();
                });
            });

            it('should store meta', (done) => {
                fixEmailAddresses.load().then((data) => {
                    expect(data.meta).toEqual(apiData.meta);
                    done();
                });
            });

            describe('data set', () => {
                beforeEach(() => {
                    fixEmailAddresses.data = apiData;
                    fixEmailAddresses.page = 1;
                });
                describe('reset set to true', () => {
                    it('should call the api', (done) => {
                        fixEmailAddresses.load(true).then(() => {
                            expect(api.get).toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('reset set to false', () => {
                    describe('page is current page', () => {
                        it('should not call the api', (done) => {
                            fixEmailAddresses.load(false, 1).then(() => {
                                expect(api.get).not.toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should return set data', (done) => {
                            fixEmailAddresses.load(false, 1).then((data) => {
                                expect(data).toEqual(fixEmailAddresses.data);
                                done();
                            });
                        });

                        it('should return a promise', () => {
                            expect(fixEmailAddresses.load(false, 1)).toEqual(jasmine.any(Promise));
                        });
                    });

                    describe('page is not current page', () => {
                        it('should call the api', (done) => {
                            fixEmailAddresses.load(false, 2).then(() => {
                                expect(api.get).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should set page', (done) => {
                            expect(fixEmailAddresses.page).toEqual(1);
                            fixEmailAddresses.load(false, 2).then(() => {
                                expect(fixEmailAddresses.page).toEqual(2);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('save', () => {
        let person;
        beforeEach(() => {
            fixEmailAddresses.data = [{ id: 'person_id', email_addresses: [{}, {}] }];
            fixEmailAddresses.page = 1;
            fixEmailAddresses.meta = { pagination: { total_count: 2 } };
            person = fixEmailAddresses.data[0];
            spyOn(people, 'save').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixEmailAddresses.save(person)).toEqual(jasmine.any(Promise));
        });

        it('should call the people service', () => {
            fixEmailAddresses.save(person);
            expect(people.save).toHaveBeenCalledWith({
                id: 'person_id',
                email_addresses: [{ valid_values: true }, { valid_values: true }]
            });
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(fixEmailAddresses, 'load').and.callFake(() => Promise.resolve());
            });

            it('should remove person from data', (done) => {
                fixEmailAddresses.save(person).then(() => {
                    expect(fixEmailAddresses.data).toEqual([]);
                    done();
                });
            });

            it('should subtract 1 from the total_count', (done) => {
                fixEmailAddresses.save(person).then(() => {
                    expect(fixEmailAddresses.meta.pagination.total_count).toEqual(1);
                    done();
                });
            });

            describe('data empty', () => {
                it('should call load', (done) => {
                    fixEmailAddresses.save(person).then(() => {
                        expect(fixEmailAddresses.load).toHaveBeenCalledWith(true, 1);
                        done();
                    });
                });
            });

            describe('data not empty', () => {
                beforeEach(() => {
                    fixEmailAddresses.data.push({ id: 'person_id_1' });
                });

                it('should not call load', (done) => {
                    fixEmailAddresses.save(person).then(() => {
                        expect(fixEmailAddresses.load).not.toHaveBeenCalled();
                        done();
                    });
                });
            });
        });
    });

    describe('bulkSave', () => {
        beforeEach(() => {
            fixEmailAddresses.data = [{
                id: 'person_id_0',
                email_addresses: [
                    {
                        id: 'email_address_id_0',
                        source: 'Sibel',
                        primary: true
                    }, {
                        id: 'email_address_id_1',
                        source: 'MPDX',
                        primary: false
                    }, {
                        id: 'email_address_id_2',
                        source: 'MPDX',
                        primary: false
                    }
                ]
            }, {
                id: 'person_id_1',
                email_addresses: [
                    {
                        id: 'email_address_id_3',
                        source: 'Sibel',
                        primary: true
                    }
                ]
            }];
            spyOn(people, 'bulkSave').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixEmailAddresses.bulkSave('MPDX')).toEqual(jasmine.any(Promise));
        });

        it('should call the people service', () => {
            fixEmailAddresses.bulkSave('MPDX');
            expect(people.bulkSave).toHaveBeenCalledWith(
                [{
                    id: 'person_id_0',
                    email_addresses: [
                        {
                            id: 'email_address_id_0',
                            source: 'Sibel',
                            primary: false,
                            valid_values: true
                        }, {
                            id: 'email_address_id_1',
                            source: 'MPDX',
                            primary: true,
                            valid_values: true
                        }, {
                            id: 'email_address_id_2',
                            source: 'MPDX',
                            primary: false,
                            valid_values: true
                        }
                    ]
                }]
            );
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(fixEmailAddresses, 'load').and.callFake(() => Promise.resolve());
            });

            it('should call load', (done) => {
                fixEmailAddresses.bulkSave('MPDX').then(() => {
                    expect(fixEmailAddresses.load).toHaveBeenCalledWith(true);
                    done();
                });
            });
        });
    });

    describe('setPrimary', () => {
        it('should set the primary email_address as primary in the person object', () => {
            let person = { email_addresses: [
                {
                    id: 'email_address_0',
                    primary: true
                }, {
                    id: 'email_address_1',
                    primary: true
                }, {
                    id: 'email_address_2',
                    primary: false
                }
            ]};
            expect(person.email_addresses[2].primary).toBeFalsy();
            fixEmailAddresses.setPrimary(person, { id: 'email_address_2' });
            expect(person.email_addresses[2].primary).toBeTruthy();
        });
    });

    describe('removeEmailAddress', () => {
        let person;

        beforeEach(() => {
            person = { email_addresses: [
                {
                    id: 'email_address_0',
                    primary: true
                }, {
                    id: 'email_address_1',
                    primary: true
                }, {
                    id: 'email_address_2',
                    primary: false
                }
            ]};
            spyOn(people, 'deleteEmailAddress').and.callFake(() => Promise.resolve());
        });

        it('should call the people service', () => {
            fixEmailAddresses.removeEmailAddress(person, { id: 'email_address_1' });
            expect(people.deleteEmailAddress).toHaveBeenCalledWith(
                person, { id: 'email_address_1' }
            );
        });

        it('should return a promise', () => {
            expect(fixEmailAddresses.removeEmailAddress(person, { id: 'email_address_1' })).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should remove email_address from person object', (done) => {
                fixEmailAddresses.removeEmailAddress(person, { id: 'email_address_1' }).then(() => {
                    expect(person).toEqual(
                        { email_addresses: [
                            {
                                id: 'email_address_0',
                                primary: true
                            }, {
                                id: 'email_address_2',
                                primary: false
                            }
                        ]}
                    );
                    done();
                });
            });
        });
    });

    describe('saveEmailAddress', () => {
        let person;

        beforeEach(() => {
            person = { email_addresses: [
                {
                    id: 'email_address_0',
                    primary: true
                }, {
                    id: 'email_address_1',
                    primary: true
                }, {
                    id: 'email_address_2',
                    primary: false
                }
            ]};
            spyOn(people, 'saveEmailAddress').and.callFake(() => Promise.resolve());
        });

        it('should call the people service', () => {
            fixEmailAddresses.saveEmailAddress(person, { id: 'email_address_1' });
            expect(people.saveEmailAddress).toHaveBeenCalledWith(
                person, { id: 'email_address_1' }
            );
        });

        it('should return a promise', () => {
            expect(fixEmailAddresses.saveEmailAddress(person, { id: 'email_address_1' })).toEqual(jasmine.any(Promise));
        });
    });

    describe('hasPrimary', () => {
        let person;

        describe('has single primary', () => {
            beforeEach(() => {
                person = {
                    id: 'person_id',
                    email_addresses: [
                        { primary: true },
                        { primary: false },
                        { primary: false }
                    ]
                };
            });

            it('should return true', () => {
                expect(fixEmailAddresses.hasPrimary(person)).toBeTruthy();
            });
        });

        describe('has multiple primaries', () => {
            beforeEach(() => {
                person = {
                    id: 'person_id',
                    email_addresses: [
                        { primary: true },
                        { primary: true },
                        { primary: false }
                    ]
                };
            });

            it('should return false', () => {
                expect(fixEmailAddresses.hasPrimary(person)).toBeFalsy();
            });
        });

        describe('has no primaries', () => {
            beforeEach(() => {
                person = {
                    id: 'person_id',
                    email_addresses: [
                        { primary: false },
                        { primary: false },
                        { primary: false }
                    ]
                };
            });

            it('should return false', () => {
                expect(fixEmailAddresses.hasPrimary(person)).toBeFalsy();
            });
        });
    });

    const apiData = [
        { email_addresses: [{ source: 'Sibel' }] },
        { email_addresses: [{ source: 'Tntmpd' }] },
        { email_addresses: [{ source: 'Dataserver' }] },
        { email_addresses: [{ source: 'Dataserver' }] }
    ];

    apiData.meta = { page: 1 };
});
