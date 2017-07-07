import service from './phoneNumbers.service';

const accountListId = 123;

describe('tools.fix.phoneNumbers.service', () => {
    let api, people, fixPhoneNumbers;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _people_, _fixPhoneNumbers_) => {
            api = _api_;
            people = _people_;
            fixPhoneNumbers = _fixPhoneNumbers_;
            api.account_list_id = accountListId;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(fixPhoneNumbers.loading).toBeFalsy();
            expect(fixPhoneNumbers.page).toEqual(1);
        });
    });

    describe('loadCount', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve({ meta: { page: 0 } }));
        });

        it('should return a promise', () => {
            expect(fixPhoneNumbers.loadCount()).toEqual(jasmine.any(Promise));
        });

        describe('meta set', () => {
            beforeEach(() => {
                fixPhoneNumbers.meta = { page: 1 };
            });

            it('should return meta', (done) => {
                fixPhoneNumbers.loadCount().then((data) => {
                    expect(data).toEqual(fixPhoneNumbers.meta);
                    done();
                });
            });

            it('should not call the api', (done) => {
                fixPhoneNumbers.loadCount().then(() => {
                    expect(api.get).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('meta not set', () => {
            it('should set and return meta', (done) => {
                fixPhoneNumbers.loadCount().then((data) => {
                    expect(data).toEqual(fixPhoneNumbers.meta);
                    done();
                });
            });

            it('should call the api', (done) => {
                fixPhoneNumbers.loadCount().then(() => {
                    expect(api.get).toHaveBeenCalledWith(
                        'contacts/people',
                        {
                            filter: {
                                phone_number_valid: false,
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
            expect(fixPhoneNumbers.load()).toEqual(jasmine.any(Promise));
        });

        it('should set loading to true', () => {
            expect(fixPhoneNumbers.loading).toBeFalsy();
            fixPhoneNumbers.load();
            expect(fixPhoneNumbers.loading).toBeTruthy();
        });

        it('should call the api', () => {
            fixPhoneNumbers.load();
            expect(api.get).toHaveBeenCalledWith(
                'contacts/people',
                {
                    filter: {
                        phone_number_valid: false,
                        account_list_id: api.account_list_id
                    },
                    fields: {
                        person: 'first_name,last_name,avatar,phone_numbers,parent_contacts'
                    },
                    include: 'phone_numbers',
                    page: 1,
                    per_page: 25
                });
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                fixPhoneNumbers.loading = true;
                fixPhoneNumbers.load().then(() => {
                    expect(fixPhoneNumbers.loading).toBeFalsy();
                    done();
                });
            });

            it('should collect list of sources', (done) => {
                fixPhoneNumbers.load().then(() => {
                    expect(fixPhoneNumbers.sources).toEqual(['Dataserver', 'MPDX', 'Sibel', 'Tntmpd']);
                    done();
                });
            });

            it('should store data', (done) => {
                fixPhoneNumbers.load().then((data) => {
                    expect(data).toEqual(apiData);
                    done();
                });
            });

            it('should store meta', (done) => {
                fixPhoneNumbers.load().then((data) => {
                    expect(data.meta).toEqual(apiData.meta);
                    done();
                });
            });

            describe('data set', () => {
                beforeEach(() => {
                    fixPhoneNumbers.data = apiData;
                    fixPhoneNumbers.page = 1;
                });
                describe('reset set to true', () => {
                    it('should call the api', (done) => {
                        fixPhoneNumbers.load(true).then(() => {
                            expect(api.get).toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('reset set to false', () => {
                    describe('page is current page', () => {
                        it('should not call the api', (done) => {
                            fixPhoneNumbers.load(false, 1).then(() => {
                                expect(api.get).not.toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should return set data', (done) => {
                            fixPhoneNumbers.load(false, 1).then((data) => {
                                expect(data).toEqual(fixPhoneNumbers.data);
                                done();
                            });
                        });

                        it('should return a promise', () => {
                            expect(fixPhoneNumbers.load(false, 1)).toEqual(jasmine.any(Promise));
                        });
                    });

                    describe('page is not current page', () => {
                        it('should call the api', (done) => {
                            fixPhoneNumbers.load(false, 2).then(() => {
                                expect(api.get).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should set page', (done) => {
                            expect(fixPhoneNumbers.page).toEqual(1);
                            fixPhoneNumbers.load(false, 2).then(() => {
                                expect(fixPhoneNumbers.page).toEqual(2);
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
            fixPhoneNumbers.data = [{ id: 'person_id', phone_numbers: [{}, {}] }];
            fixPhoneNumbers.page = 1;
            fixPhoneNumbers.meta = { pagination: { total_count: 2 } };
            person = fixPhoneNumbers.data[0];
            spyOn(people, 'save').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixPhoneNumbers.save(person)).toEqual(jasmine.any(Promise));
        });

        it('should call the people service', () => {
            fixPhoneNumbers.save(person);
            expect(people.save).toHaveBeenCalledWith({
                id: 'person_id',
                phone_numbers: [{ valid_values: true }, { valid_values: true }]
            });
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(fixPhoneNumbers, 'load').and.callFake(() => Promise.resolve());
            });

            it('should remove person from data', (done) => {
                fixPhoneNumbers.save(person).then(() => {
                    expect(fixPhoneNumbers.data).toEqual([]);
                    done();
                });
            });

            it('should subtract 1 from the total_count', (done) => {
                fixPhoneNumbers.save(person).then(() => {
                    expect(fixPhoneNumbers.meta.pagination.total_count).toEqual(1);
                    done();
                });
            });

            describe('data empty', () => {
                it('should call load', (done) => {
                    fixPhoneNumbers.save(person).then(() => {
                        expect(fixPhoneNumbers.load).toHaveBeenCalledWith(true, 1);
                        done();
                    });
                });
            });

            describe('data not empty', () => {
                beforeEach(() => {
                    fixPhoneNumbers.data.push({ id: 'person_id_1' });
                });

                it('should not call load', (done) => {
                    fixPhoneNumbers.save(person).then(() => {
                        expect(fixPhoneNumbers.load).not.toHaveBeenCalled();
                        done();
                    });
                });
            });
        });
    });

    describe('bulkSave', () => {
        beforeEach(() => {
            fixPhoneNumbers.data = [{
                id: 'person_id_0',
                phone_numbers: [
                    {
                        id: 'phone_number_id_0',
                        source: 'Sibel',
                        primary: true
                    }, {
                        id: 'phone_number_id_1',
                        source: 'MPDX',
                        primary: false
                    }, {
                        id: 'phone_number_id_2',
                        source: 'MPDX',
                        primary: false
                    }
                ]
            }, {
                id: 'person_id_1',
                phone_numbers: [
                    {
                        id: 'phone_number_id_3',
                        source: 'Sibel',
                        primary: true
                    }
                ]
            }];
            spyOn(people, 'bulkSave').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixPhoneNumbers.bulkSave('MPDX')).toEqual(jasmine.any(Promise));
        });

        it('should call the people service', () => {
            fixPhoneNumbers.bulkSave('MPDX');
            expect(people.bulkSave).toHaveBeenCalledWith(
                [{
                    id: 'person_id_0',
                    phone_numbers: [
                        {
                            id: 'phone_number_id_0',
                            source: 'Sibel',
                            primary: false,
                            valid_values: true
                        }, {
                            id: 'phone_number_id_1',
                            source: 'MPDX',
                            primary: true,
                            valid_values: true
                        }, {
                            id: 'phone_number_id_2',
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
                spyOn(fixPhoneNumbers, 'load').and.callFake(() => Promise.resolve());
            });

            it('should call load', (done) => {
                fixPhoneNumbers.bulkSave('MPDX').then(() => {
                    expect(fixPhoneNumbers.load).toHaveBeenCalledWith(true);
                    done();
                });
            });
        });
    });

    describe('setPrimary', () => {
        it('should set the primary phone_number as primary in the person object', () => {
            let person = { phone_numbers: [
                {
                    id: 'phone_number_0',
                    primary: true
                }, {
                    id: 'phone_number_1',
                    primary: true
                }, {
                    id: 'phone_number_2',
                    primary: false
                }
            ]};
            expect(person.phone_numbers[2].primary).toBeFalsy();
            fixPhoneNumbers.setPrimary(person, { id: 'phone_number_2' });
            expect(person.phone_numbers[2].primary).toBeTruthy();
        });
    });

    describe('removePhoneNumber', () => {
        let person;

        beforeEach(() => {
            person = { phone_numbers: [
                {
                    id: 'phone_number_0',
                    primary: true
                }, {
                    id: 'phone_number_1',
                    primary: true
                }, {
                    id: 'phone_number_2',
                    primary: false
                }
            ]};
            spyOn(people, 'deletePhoneNumber').and.callFake(() => Promise.resolve());
        });

        it('should call the people service', () => {
            fixPhoneNumbers.removePhoneNumber(person, { id: 'phone_number_1' });
            expect(people.deletePhoneNumber).toHaveBeenCalledWith(
                person, { id: 'phone_number_1' }
            );
        });

        it('should return a promise', () => {
            expect(fixPhoneNumbers.removePhoneNumber(person, { id: 'phone_number_1' })).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should remove phone_number from person object', (done) => {
                fixPhoneNumbers.removePhoneNumber(person, { id: 'phone_number_1' }).then(() => {
                    expect(person).toEqual(
                        { phone_numbers: [
                            {
                                id: 'phone_number_0',
                                primary: true
                            }, {
                                id: 'phone_number_2',
                                primary: false
                            }
                        ]}
                    );
                    done();
                });
            });
        });
    });

    describe('savePhoneNumber', () => {
        let person;

        beforeEach(() => {
            person = { phone_numbers: [
                {
                    id: 'phone_number_0',
                    primary: true
                }, {
                    id: 'phone_number_1',
                    primary: true
                }, {
                    id: 'phone_number_2',
                    primary: false
                }
            ]};
            spyOn(people, 'savePhoneNumber').and.callFake(() => Promise.resolve());
        });

        it('should call the people service', () => {
            fixPhoneNumbers.savePhoneNumber(person, { id: 'phone_number_1' });
            expect(people.savePhoneNumber).toHaveBeenCalledWith(
                person, { id: 'phone_number_1' }
            );
        });

        it('should return a promise', () => {
            expect(fixPhoneNumbers.savePhoneNumber(person, { id: 'phone_number_1' })).toEqual(jasmine.any(Promise));
        });
    });

    describe('hasPrimary', () => {
        let person;

        describe('has single primary', () => {
            beforeEach(() => {
                person = {
                    id: 'person_id',
                    phone_numbers: [
                        { primary: true },
                        { primary: false },
                        { primary: false }
                    ]
                };
            });

            it('should return true', () => {
                expect(fixPhoneNumbers.hasPrimary(person)).toBeTruthy();
            });
        });

        describe('has multiple primaries', () => {
            beforeEach(() => {
                person = {
                    id: 'person_id',
                    phone_numbers: [
                        { primary: true },
                        { primary: true },
                        { primary: false }
                    ]
                };
            });

            it('should return false', () => {
                expect(fixPhoneNumbers.hasPrimary(person)).toBeFalsy();
            });
        });

        describe('has no primaries', () => {
            beforeEach(() => {
                person = {
                    id: 'person_id',
                    phone_numbers: [
                        { primary: false },
                        { primary: false },
                        { primary: false }
                    ]
                };
            });

            it('should return false', () => {
                expect(fixPhoneNumbers.hasPrimary(person)).toBeFalsy();
            });
        });
    });

    const apiData = [
        { phone_numbers: [{ source: 'Sibel' }] },
        { phone_numbers: [{ source: 'Tntmpd' }] },
        { phone_numbers: [{ source: 'Dataserver' }] },
        { phone_numbers: [{ source: 'Dataserver' }] }
    ];

    apiData.meta = { page: 1 };
});
