import service from './csv.service';

const fakeBlockUI = {
    reset: () => {},
    start: () => {}
};

const csvImport = {
    supported_headers: {
        church: 'Church',
        city: 'City',
        commitment_amount: 'Commitment Amount',
        commitment_currency: 'Commitment Currency',
        commitment_frequency: 'Commitment Frequency',
        country: 'Country',
        email_1: 'Email 1',
        email_2: 'Email 2',
        envelope_greeting: 'Envelope Greeting',
        first_name: 'First Name',
        greeting: 'Greeting',
        last_name: 'Last Name',
        likely_to_give: 'Likely To Give',
        metro_area: 'Metro Area',
        newsletter: 'Newsletter',
        notes: 'Notes',
        phone_1: 'Phone 1',
        phone_2: 'Phone 2',
        phone_3: 'Phone 3',
        region: 'Region',
        send_appeals: 'Send Goals?',
        spouse_email: 'Spouse Email',
        spouse_first_name: 'Spouse First Name',
        spouse_last_name: 'Spouse Last Name',
        spouse_phone: 'Spouse Phone',
        state: 'State',
        status: 'Status',
        street: 'Street',
        tags: 'Tags',
        website: 'Website',
        zip: 'Zip'
    },
    required_headers: {
        first_name: 'First Name',
        last_name: 'Last Name'
    },
    constants: {
        commitment_currency: {
            usd: 'USD',
            '': ''
        },
        commitment_frequency: {
            '0_23076923076923': '0.23076923076923',
            '0_46153846153846': '0.46153846153846',
            '1_0': '1.0',
            '2_0': '2.0',
            '3_0': '3.0',
            '4_0': '4.0',
            '6_0': '6.0',
            '12_0': '12.0',
            '24_0': '24.0',
            '': ''
        },
        likely_to_give: {
            least_likely: 'Least Likely',
            likely: 'Likely',
            most_likely: 'Most Likely',
            '': ''
        },
        newsletter: {
            physical: 'Physical',
            email: 'Email',
            both: 'Both',
            '': ''
        },
        send_appeals: {
            true: 'true',
            false: 'false',
            '': ''
        },
        status: {
            never_contacted: 'Never Contacted',
            ask_in_future: 'Ask in Future',
            cultivate_relationship: 'Cultivate Relationship',
            contact_for_appointment: 'Contact for Appointment',
            appointment_scheduled: 'Appointment Scheduled',
            call_for_decision: 'Call for Decision',
            partner_financial: 'Partner - Financial',
            partner_special: 'Partner - Special',
            partner_pray: 'Partner - Pray',
            not_interested: 'Not Interested',
            unresponsive: 'Unresponsive',
            never_ask: 'Never Ask',
            research_abandoned: 'Research Abandoned',
            expired_referral: 'Expired Referral',
            '': ''
        }
    },
    max_file_size_in_bytes: 150000000
};

describe('tools.import.csv.service', () => {
    let alerts, api, gettextCatalog, help, importCsv, state, serverConstants, Upload, q, rootScope;

    beforeEach(() => {
        angular.mock.module(service);
        inject((
            $state, _alerts_, _api_, _gettextCatalog_, _help_, _importCsv_, _serverConstants_, _Upload_, $q, $rootScope
        ) => {
            alerts = _alerts_;
            api = _api_;
            gettextCatalog = _gettextCatalog_;
            help = _help_;
            importCsv = _importCsv_;
            serverConstants = _serverConstants_;
            state = $state;
            Upload = _Upload_;
            q = $q;
            rootScope = $rootScope;
            spyOn(importCsv, 'blockUI').and.callFake(() => fakeBlockUI);
            spyOn(importCsv.blockUI, 'reset').and.callThrough();
            spyOn(importCsv.blockUI, 'start').and.callThrough();
            api.apiUrl = 'https://api.mpdx.org/api/v2/';
            api.account_list_id = 'account_list_id';
        });
    });

    describe('$onInit', () => {
        it('should call reset', () => {
            spyOn(importCsv, 'reset').and.callFake(() => {});
            importCsv.$onInit();
            expect(importCsv.reset).toHaveBeenCalled();
        });
    });

    describe('reset', () => {
        it('should set default values', () => {
            importCsv.data = {};
            importCsv.dataInitialState = {};
            importCsv.values_to_constants_mappings = { key: 'value' };
            importCsv.available_constants = { key: 'value' };
            importCsv.reset();
            expect(importCsv.data).toEqual(null);
            expect(importCsv.dataInitialState).toEqual(null);
            expect(importCsv.values_to_constants_mappings).toEqual({});
        });
    });

    describe('upload', () => {
        const file = {};

        it('should call blockUI.start', () => {
            importCsv.upload(file);
            expect(importCsv.blockUI.start).toHaveBeenCalled();
        });

        it('should call Upload.upload', () => {
            spyOn(Upload, 'upload').and.callFake(() => q.resolve());
            importCsv.upload(file);
            expect(Upload.upload).toHaveBeenCalledWith({
                method: 'POST',
                url: 'https://api.mpdx.org/api/v2/account_lists/account_list_id/imports/csv',
                data: {
                    data: {
                        type: 'imports',
                        attributes: {
                            file: file
                        }
                    }
                }
            });
        });

        it('should call Upload.upload', () => {
            spyOn(Upload, 'upload').and.callFake(() => q.resolve());
            expect(importCsv.upload(file)).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            const resp = { data: { data: { id: 'import_csv_id' } } };

            beforeEach(() => {
                spyOn(Upload, 'upload').and.callFake(() => q.resolve(resp));
            });

            it('should call blockUI.reset', (done) => {
                importCsv.upload(file).then(() => {
                    expect(importCsv.blockUI.reset).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });

            it('should call next', (done) => {
                spyOn(importCsv, 'next').and.callFake(() => {});
                importCsv.upload(file).then(() => {
                    expect(importCsv.next).toHaveBeenCalledWith(resp.data.data.id);
                    done();
                });
                rootScope.$digest();
            });
        });

        describe('promise rejected', () => {
            const error = { status: 500 };

            beforeEach(() => {
                spyOn(Upload, 'upload').and.callFake(() => q.reject(error));
            });

            it('should call blockUI.reset', (done) => {
                importCsv.upload(file).catch(() => {
                    expect(importCsv.blockUI.reset).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });

            it('should call gettextCatalog.getString', (done) => {
                spyOn(gettextCatalog, 'getString').and.callFake((string) => string);
                importCsv.upload(file).catch(() => {
                    expect(gettextCatalog.getString).toHaveBeenCalledWith('Invalid CSV file - See help docs or send us a message with your CSV attached');
                    expect(gettextCatalog.getString).toHaveBeenCalledWith('590a049b0428634b4a32d13d');
                    done();
                });
                rootScope.$digest();
            });

            it('should call alerts.addAlert', (done) => {
                spyOn(alerts, 'addAlert').and.callFake(() => {});
                importCsv.upload(file).catch(() => {
                    expect(alerts.addAlert).toHaveBeenCalledWith(
                        'Invalid CSV file - See help docs or send us a message with your CSV attached',
                        'danger',
                        error.status
                    );
                    done();
                });
                rootScope.$digest();
            });

            it('should call help.showArticle', (done) => {
                spyOn(help, 'showArticle').and.callFake(() => {});
                importCsv.upload(file).catch(() => {
                    expect(help.showArticle).toHaveBeenCalledWith('590a049b0428634b4a32d13d');
                    done();
                });
                rootScope.$digest();
            });

            it('should pass error', (done) => {
                spyOn(help, 'showArticle').and.callFake(() => {});
                importCsv.upload(file).catch((promiseError) => {
                    expect(promiseError).toEqual(error);
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('process', () => {
        let data = {};

        beforeEach(() => {
            serverConstants.data = { csv_import: csvImport };
        });

        it('should set dataInitialState', () => {
            importCsv.process(data);
            expect(importCsv.dataInitialState).toEqual({});
        });

        describe('file_headers_mappings', () => {
            describe('file_headers_mappings not set', () => {
                beforeEach(() => {
                    data = {
                        file_headers_mappings: {},
                        file_headers: {
                            first_name: 'First Name',
                            middle_name: 'Middle Name',
                            last_name: 'Last Name',
                            title: 'Title'
                        }
                    };
                });

                it('should set headers_to_fields_mapping', () => {
                    importCsv.process(data);
                    expect(importCsv.data.file_headers_mappings).toEqual(
                        { first_name: 'first_name', last_name: 'last_name' }
                    );
                });
            });

            describe('file_headers_mappings set', () => {
                beforeEach(() => {
                    data = {
                        file_headers_mappings: {
                            first_name: 'first_name',
                            last_name: 'middle_name'
                        },
                        file_headers: {
                            first_name: 'First Name',
                            middle_name: 'Middle Name',
                            last_name: 'Last Name',
                            title: 'Title'
                        }
                    };
                });

                it('should not set file_headers_mappings', () => {
                    importCsv.process(data);
                    expect(importCsv.data.file_headers_mappings).toEqual(
                        { first_name: 'first_name', middle_name: 'last_name' }
                    );
                });
            });
        });

        describe('values_to_constants_mappings', () => {
            beforeEach(() => {
                data = {
                    file_constants_mappings: {
                        newsletter: [{
                            id: '',
                            values: ['none_1', 'none_2', 'none_3', 'none_4', 'physical']
                        }, {
                            id: 'email',
                            values: ['email']
                        }, {
                            id: 'both',
                            values: ['both']
                        }, {
                            id: 'physical',
                            values: ['physical']
                        }],
                        status: [{
                            id: '',
                            values: [null]
                        }, {
                            id: 'never_contacted',
                            values: ['never_contacted']
                        }],
                        send_appeals: [{
                            id: '',
                            values: [null]
                        }]
                    }
                };
                serverConstants.data.csv_import.constants = {
                    status: 'status_hashes',
                    newsletter: 'newsletter_hashes'
                };
                serverConstants.data.status_hashes = [
                    { id: 'never_contacted', value: 'never_contacted' }
                ];
                serverConstants.data.newsletter_hashes = [
                    { id: 'physical', value: 'physical' },
                    { id: 'email', value: 'email' },
                    { id: 'both', value: 'both' }
                ];
            });

            it('should set values_to_constants_mappings', () => {
                importCsv.process(data);
                expect(importCsv.values_to_constants_mappings).toEqual(
                    {
                        newsletter: {
                            'none_1': null,
                            'none_2': null,
                            'none_3': null,
                            'none_4': null,
                            'physical': 'physical',
                            'email': 'email',
                            'both': 'both'
                        },
                        status: {
                            'never_contacted': 'never_contacted'
                        },
                        send_appeals: {}
                    }
                );
            });
        });

        describe('tag_list', () => {
            describe('tag_list undefined', () => {
                it('should set tag_list', () => {
                    importCsv.process(data);
                    expect(importCsv.data.tag_list).toEqual([]);
                });
            });

            describe('tag_list defined', () => {
                beforeEach(() => {
                    data = {
                        tag_list: ['test']
                    };
                });

                it('should not set tag_list', () => {
                    importCsv.process(data);
                    expect(importCsv.data.tag_list).toEqual(['test']);
                });
            });
        });
    });

    describe('get', () => {
        const importId = 'import_id';

        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => q.resolve({ test: 'data' }));
        });

        it('should return a promise', () => {
            expect(importCsv.get(importId)).toEqual(jasmine.any(q));
        });

        it('should reset values_to_constants_mappings', () => {
            importCsv.values_to_constants_mappings = { test: 'id' };
            importCsv.get(importId);
            expect(importCsv.values_to_constants_mappings).toEqual({});
        });

        it('should block the UI', () => {
            importCsv.get(importId);
            expect(importCsv.blockUI.start).toHaveBeenCalled();
        });

        it('should call the api', () => {
            importCsv.get(importId);
            expect(api.get).toHaveBeenCalledWith(
                `account_lists/${api.account_list_id}/imports/csv/${importId}`,
                {
                    include: 'sample_contacts,sample_contacts.addresses,sample_contacts.primary_person,sample_contacts.primary_person.email_addresses,sample_contacts.primary_person.phone_numbers,sample_contacts.spouse,sample_contacts.spouse.email_addresses,sample_contacts.spouse.phone_numbers'
                });
        });

        describe('data cached', () => {
            beforeEach(() => {
                importCsv.data = { id: importId };
            });

            it('should not call the api', () => {
                importCsv.get(importId);
                expect(api.get).not.toHaveBeenCalled();
            });

            it('should return a promise', () => {
                expect(importCsv.get(importId)).toEqual(jasmine.any(q));
            });

            describe('promise successful', () => {
                it('should return data', (done) => {
                    importCsv.get(importId).then((data) => {
                        expect(data).toEqual({ id: importId });
                        done();
                    });
                    rootScope.$digest();
                });
            });
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(importCsv, 'process').and.callFake(() => {});
            });

            it('should unblock the UI', (done) => {
                importCsv.get(importId).then(() => {
                    expect(importCsv.blockUI.reset).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });

            it('should call process', (done) => {
                importCsv.get(importId).then(() => {
                    expect(importCsv.process).toHaveBeenCalledWith({ test: 'data' });
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('constantsMappingsToValueMappings', () => {
        it('should return deserialized object', () => {
            let fileConstants = {
                send_letter: [
                    'abc',
                    'def',
                    'ghi',
                    'jkl',
                    'mno',
                    'pqr'
                ]
            };
            let fileHeadersMappings = {
                send_letter: 'newsletter'
            };
            let data = {
                newsletter: [
                    {
                        id: 'Physical',
                        values: ['abc', 'def']
                    },
                    {
                        id: 'Both',
                        values: ['ghi', 'jkl']
                    }
                ]
            };
            let formattedData = {
                newsletter: {
                    'abc': 'Physical',
                    'def': 'Physical',
                    'ghi': 'Both',
                    'jkl': 'Both',
                    'mno': '',
                    'pqr': ''
                }
            };

            expect(importCsv.constantsMappingsToValueMappings(
                data, fileConstants, fileHeadersMappings
            )).toEqual(formattedData);
        });
    });

    describe('valueMappingsToConstantsMappings', () => {
        beforeEach(() => {
            serverConstants.data = { csv_import: csvImport };
        });

        it('should return serialized object', () => {
            let fileConstants = {
                send_letter: [
                    'abc',
                    'def',
                    'ghi',
                    'jkl',
                    'mno',
                    'pqr'
                ]
            };
            let fileHeadersMappings = {
                send_letter: 'newsletter'
            };
            let formattedData = {
                newsletter: {
                    'abc': 'Physical',
                    'def': 'Physical',
                    'ghi': 'Both',
                    'mno': null,
                    'pqr': 'null'
                }
            };
            let data = {
                newsletter: [
                    {
                        id: 'Physical',
                        values: ['abc', 'def']
                    },
                    {
                        id: 'Both',
                        values: ['ghi']
                    },
                    {
                        id: '',
                        values: ['mno', 'pqr', 'jkl']
                    }
                ]
            };
            expect(importCsv.valueMappingsToConstantsMappings(
                formattedData, fileConstants, fileHeadersMappings
            )).toEqual(data);
        });
    });

    describe('getConstantValues', () => {
        it('gets values from fileHeadersMappings based on constant name', () => {
            const constants = {
                send_letter: [
                    'abc',
                    'def',
                    'ghi',
                    'jkl',
                    'mno',
                    'pqr'
                ]
            };
            const fileHeadersMappings = {
                send_letter: 'newsletter'
            };

            expect(importCsv.getConstantValues('newsletter', constants, fileHeadersMappings)).toEqual([
                'abc', 'def', 'ghi', 'jkl', 'mno', 'pqr'
            ]);
        });
    });

    describe('save', () => {
        const importId = 'import_id';
        let spyApi;
        let data = {
            id: importId,
            file_headers_mappings: {},
            file_constants_mappings: {}
        };

        beforeEach(() => {
            spyApi = spyOn(api, 'put').and.callFake(() => q.resolve({ test: 'data' }));
            serverConstants.data = { csv_import: csvImport };
            importCsv.data = data;
            importCsv.dataInitialState = angular.copy(data);
        });

        it('should return a promise', () => {
            expect(importCsv.save()).toEqual(jasmine.any(q));
        });

        it('should block the UI', () => {
            importCsv.save();
            expect(importCsv.blockUI.start).toHaveBeenCalled();
        });

        it('should call the api', () => {
            const errorMessage = 'Unable to save your CSV import settings - See help docs or send us a message with your CSV attached';
            importCsv.save();
            expect(api.put).toHaveBeenCalledWith({
                url: `account_lists/${api.account_list_id}/imports/csv/${data.id}?include=sample_contacts,sample_contacts.addresses,sample_contacts.primary_person,sample_contacts.primary_person.email_addresses,sample_contacts.primary_person.phone_numbers,sample_contacts.spouse,sample_contacts.spouse.email_addresses,sample_contacts.spouse.phone_numbers`,
                data: { id: importId },
                type: 'imports',
                errorMessage: errorMessage
            });
        });

        describe('tag_list', () => {
            beforeEach(() => {
                importCsv.data.tag_list = ['test', 'post', 'please', 'ignore'];
            });

            it('should join tag_list by commas', () => {
                importCsv.save();
                expect(importCsv.data.tag_list).toEqual('test,post,please,ignore');
            });
        });

        describe('file_headers_mappings', () => {
            beforeEach(() => {
                importCsv.data.file_headers_mappings = {
                    a: null,
                    b: undefined,
                    c: 'test'
                };
            });

            it('should set file_headers_mappings', () => {
                importCsv.save();
                expect(importCsv.data.file_headers_mappings).toEqual({ test: 'c' });
            });
        });

        describe('file_constants_mappings', () => {
            beforeEach(() => {
                importCsv.values_to_constants_mappings = {
                    newsletter: {
                        'none_1': '',
                        'none_2': null,
                        'none_3': 'null',
                        'none_4': '',
                        'physical_1': 'physical',
                        'email_1': 'email',
                        'both_1': 'both'
                    }
                };
            });

            it('should set file_constants_mappings', () => {
                importCsv.save();
                expect(importCsv.data.file_constants_mappings).toEqual({
                    newsletter: [
                        {
                            id: '',
                            values: ['none_1', 'none_2', 'none_3', 'none_4']
                        },
                        {
                            id: 'physical',
                            values: ['physical_1']
                        },
                        {
                            id: 'email',
                            values: ['email_1']
                        },
                        {
                            id: 'both',
                            values: ['both_1']
                        }
                    ]
                });
            });

            describe('only unmapped constants present', () => {
                beforeEach(() => {
                    importCsv.data.file_constants = {
                        categories: [
                            'test_1',
                            'test_2',
                            'test_3',
                            'test_4',
                            'test_5'
                        ]
                    };
                    importCsv.data.file_headers_mappings = {
                        categories: 'status'
                    };
                    importCsv.values_to_constants_mappings = {};
                });

                it('should add unmapped constants to file_constants_mappings', () => {
                    importCsv.save();
                    expect(importCsv.data.file_constants_mappings).toEqual(
                        {
                            status: [{
                                id: '',
                                values: [
                                    'test_1',
                                    'test_2',
                                    'test_3',
                                    'test_4',
                                    'test_5'
                                ]
                            }]
                        });
                });
            });

            describe('mapped and unmapped constants present', () => {
                beforeEach(() => {
                    importCsv.data.file_constants = {
                        categories: [
                            'test_1',
                            'test_2',
                            'test_3',
                            'test_4',
                            'test_5'
                        ]
                    };
                    importCsv.data.file_headers_mappings = {
                        categories: 'status'
                    };
                    importCsv.values_to_constants_mappings = {
                        status: {
                            'test_5': 'Never Contacted'
                        }
                    };
                });

                it('should add unmapped constants to file_constants_mappings', () => {
                    importCsv.save();
                    expect(importCsv.data.file_constants_mappings).toEqual(
                        {
                            status: [{
                                id: 'Never Contacted',
                                values: [
                                    'test_5'
                                ]
                            }, {
                                id: '',
                                values: [
                                    'test_1',
                                    'test_2',
                                    'test_3',
                                    'test_4'
                                ]
                            }]
                        });
                });
            });

            describe('only mapped constants present', () => {
                beforeEach(() => {
                    importCsv.data.file_constants = {
                        categories: [
                            'test_1',
                            'test_2'
                        ]
                    };
                    importCsv.data.file_headers_mappings = {
                        categories: 'status'
                    };
                    importCsv.values_to_constants_mappings = {
                        status: {
                            'test_1': 'Never Contacted',
                            'test_2': 'Never Contacted'
                        }
                    };
                });

                it('should add unmapped constants to file_constants_mappings', () => {
                    importCsv.save();
                    expect(importCsv.data.file_constants_mappings).toEqual(
                        {
                            status: [{
                                id: 'Never Contacted',
                                values: [
                                    'test_1',
                                    'test_2'
                                ]
                            }]
                        });
                });
            });
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(importCsv, 'process').and.callFake(() => {});
                spyOn(importCsv, 'next').and.callFake(() => {});
            });

            it('should unblock the UI', (done) => {
                importCsv.save().then(() => {
                    expect(importCsv.blockUI.reset).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });

            it('should call process', (done) => {
                importCsv.save().then(() => {
                    expect(importCsv.process).toHaveBeenCalledWith({ test: 'data' });
                    done();
                });
                rootScope.$digest();
            });

            it('should call next', (done) => {
                importCsv.save().then(() => {
                    expect(importCsv.next).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });
        });

        describe('promise unsuccessful', () => {
            beforeEach(() => {
                spyApi.and.callFake(() => q.reject(new Error('something bad happened')));
                spyOn(gettextCatalog, 'getString').and.callFake((string) => string);
            });

            it('should unblock the UI', (done) => {
                importCsv.save().catch(() => {
                    expect(importCsv.blockUI.reset).toHaveBeenCalled();
                    done();
                });
                rootScope.$digest();
            });

            it('should call gettextCatalog.getString', (done) => {
                importCsv.save().catch(() => {
                    expect(gettextCatalog.getString).toHaveBeenCalledWith(
                        'Unable to save your CSV import settings - See help docs or send us a message with your CSV attached');
                    done();
                });
                rootScope.$digest();
            });
        });
    });

    describe('next', () => {
        const importId = 'import_id';

        beforeEach(() => {
            spyOn(state, 'go').and.callFake(() => {});
        });

        describe('current state is tools.import.csv.upload', () => {
            beforeEach(() => {
                state.$current.name = 'tools.import.csv.upload';
            });

            it('should redirect to tools.import.csv.headers', () => {
                importCsv.next(importId);
                expect(state.go).toHaveBeenCalledWith('tools.import.csv.headers', { importId: importId });
            });
        });

        describe('current state is tools.import.csv.headers', () => {
            beforeEach(() => {
                state.$current.name = 'tools.import.csv.headers';
            });

            describe('constants to map', () => {
                beforeEach(() => {
                    importCsv.values_to_constants_mappings = { map: 'constants' };
                });

                it('should redirect to tools.import.csv.values', () => {
                    importCsv.next(importId);
                    expect(state.go).toHaveBeenCalledWith('tools.import.csv.values', { importId: importId });
                });
            });

            describe('no constants to map', () => {
                it('should redirect to toolsimport.csv.preview', () => {
                    importCsv.next(importId);
                    expect(state.go).toHaveBeenCalledWith('tools.import.csv.preview', { importId: importId });
                });
            });
        });

        describe('current state is tools.import.csv.values', () => {
            beforeEach(() => {
                state.$current.name = 'tools.import.csv.values';
            });

            it('should redirect to tools.import.csv.headers', () => {
                importCsv.next(importId);
                expect(state.go).toHaveBeenCalledWith('tools.import.csv.preview', { importId: importId });
            });
        });

        describe('current state not set', () => {
            it('should redirect to tools', () => {
                importCsv.next(importId);
                expect(state.go).toHaveBeenCalledWith('tools');
            });

            it('should call reset', () => {
                spyOn(importCsv, 'reset').and.callFake(() => {});
                importCsv.next(importId);
                expect(importCsv.reset).toHaveBeenCalled();
            });
        });
    });

    describe('back', () => {
        const importId = 'import_id';

        beforeEach(() => {
            importCsv.data = { id: importId };
            spyOn(state, 'go').and.callFake(() => {});
        });

        describe('current state is tools.import.csv.preview', () => {
            beforeEach(() => {
                state.$current.name = 'tools.import.csv.preview';
            });

            describe('constants to map', () => {
                beforeEach(() => {
                    importCsv.values_to_constants_mappings = { map: 'constants' };
                });

                it('should redirect to tools.import.csv.values', () => {
                    importCsv.back();
                    expect(state.go).toHaveBeenCalledWith('tools.import.csv.values', { importId: importId });
                });
            });

            describe('no constants to map', () => {
                it('should redirect to toolsimport.csv.headers', () => {
                    importCsv.back();
                    expect(state.go).toHaveBeenCalledWith('tools.import.csv.headers', { importId: importId });
                });
            });
        });

        describe('current state is tools.import.csv.values', () => {
            beforeEach(() => {
                state.$current.name = 'tools.import.csv.values';
            });

            it('should redirect to tools.import.csv.headers', () => {
                importCsv.back();
                expect(state.go).toHaveBeenCalledWith('tools.import.csv.headers', { importId: importId });
            });
        });

        describe('current state is tools.import.csv.headers', () => {
            beforeEach(() => {
                state.$current.name = 'tools.import.csv.headers';
            });

            it('should redirect to tools.import.csv.headers', () => {
                importCsv.back();
                expect(state.go).toHaveBeenCalledWith('tools.import.csv.upload');
            });

            it('should call reset', () => {
                spyOn(importCsv, 'reset').and.callFake(() => {});
                importCsv.back();
                expect(importCsv.reset).toHaveBeenCalled();
            });
        });

        describe('current state not set', () => {
            it('should redirect to tools', () => {
                importCsv.back();
                expect(state.go).toHaveBeenCalledWith('tools');
            });

            it('should call reset', () => {
                spyOn(importCsv, 'reset').and.callFake(() => {});
                importCsv.back();
                expect(importCsv.reset).toHaveBeenCalled();
            });
        });
    });
});
