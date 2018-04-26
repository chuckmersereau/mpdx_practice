import service from './newsletter.service';

const accountListId = 123;
const apiData = [
    {
        // physical
        send_newsletter: null,
        addresses: [
            { primary_mailing_address: true },
            { primary_mailing_address: false }
        ]
    }, {
        // email
        send_newsletter: null,
        primary_person: {
            email_addresses: [
                { primary: true }
            ]
        },
        addresses: []
    }, {
        // both
        send_newsletter: null,
        primary_person: {
            email_addresses: [
                { primary: true }
            ]
        },
        addresses: [
            { primary_mailing_address: true },
            { primary_mailing_address: false }
        ]
    }, {
        // none
        send_newsletter: null,
        primary_person: null,
        addresses: []
    }, {
        // email where person opted out - none
        send_newsletter: null,
        primary_person: {
            optout_enewsletter: true,
            email_addresses: [
                { primary: true }
            ]
        }
    }
];

describe('tools.fix.sendNewsletter.service', () => {
    let api, contacts, fixSendNewsletter, tools;

    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _contacts_, _fixSendNewsletter_, _tools_) => {
            api = _api_;
            contacts = _contacts_;
            fixSendNewsletter = _fixSendNewsletter_;
            tools = _tools_;
            api.account_list_id = accountListId;
        });
    });

    describe('constructor', () => {
        it('should set default values', () => {
            expect(fixSendNewsletter.loading).toBeFalsy();
            expect(fixSendNewsletter.page).toEqual(1);
        });
    });

    describe('load', () => {
        beforeEach(() => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve(apiData));
        });

        it('should return a promise', () => {
            expect(fixSendNewsletter.load()).toEqual(jasmine.any(Promise));
        });

        it('should set loading to true', () => {
            expect(fixSendNewsletter.loading).toBeFalsy();
            fixSendNewsletter.load();
            expect(fixSendNewsletter.loading).toBeTruthy();
        });

        it('should call the api', () => {
            fixSendNewsletter.load();
            expect(api.get).toHaveBeenCalledWith(
                'contacts',
                {
                    filter: {
                        account_list_id: api.account_list_id,
                        newsletter: 'no_value',
                        status: 'Partner - Financial,Partner - Special,Partner - Pray',
                        deceased: false
                    },
                    fields: {
                        contact: 'avatar,name,status,newsletter,addresses,primary_person'
                    },
                    include: 'addresses,people,people.email_addresses',
                    sort: 'name',
                    page: 1,
                    per_page: 10
                });
        });

        describe('promise successful', () => {
            it('should set loading to false', (done) => {
                fixSendNewsletter.loading = true;
                fixSendNewsletter.load().then(() => {
                    expect(fixSendNewsletter.loading).toBeFalsy();
                    done();
                });
            });

            it('should call set meta', (done) => {
                spyOn(fixSendNewsletter, 'setMeta').and.callThrough();
                fixSendNewsletter.load().then(() => {
                    expect(fixSendNewsletter.setMeta).toHaveBeenCalled();
                    done();
                });
            });

            it('should store data', (done) => {
                fixSendNewsletter.load().then((data) => {
                    expect(data[0].send_newsletter).toEqual('Physical');
                    expect(data[1].send_newsletter).toEqual('Email');
                    expect(data[2].send_newsletter).toEqual('Both');
                    expect(data[3].send_newsletter).toEqual('None');
                    expect(data[4].send_newsletter).toEqual('None');
                    expect(data[0].addresses).toEqual([{
                        primary_mailing_address: true
                    }]);
                    done();
                });
            });

            it('should store meta', (done) => {
                fixSendNewsletter.load().then(() => {
                    expect(fixSendNewsletter.meta).toEqual(apiData.meta);
                    done();
                });
            });

            describe('data set', () => {
                beforeEach(() => {
                    fixSendNewsletter.data = apiData;
                    fixSendNewsletter.page = 1;
                });

                describe('reset set to true', () => {
                    it('should call the api', (done) => {
                        fixSendNewsletter.load(true).then(() => {
                            expect(api.get).toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('reset set to false', () => {
                    describe('page is current page', () => {
                        it('should not call the api', (done) => {
                            fixSendNewsletter.load(false, 1).then(() => {
                                expect(api.get).not.toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should return set data', (done) => {
                            fixSendNewsletter.load(false, 1).then((data) => {
                                expect(data).toEqual(fixSendNewsletter.data);
                                done();
                            });
                        });

                        it('should return a promise', () => {
                            expect(fixSendNewsletter.load(false, 1)).toEqual(jasmine.any(Promise));
                        });
                    });

                    describe('page is not current page', () => {
                        it('should call the api', (done) => {
                            fixSendNewsletter.load(false, 2).then(() => {
                                expect(api.get).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should set page', (done) => {
                            expect(fixSendNewsletter.page).toEqual(1);
                            fixSendNewsletter.load(false, 2).then(() => {
                                expect(fixSendNewsletter.page).toEqual(2);
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
            fixSendNewsletter.setMeta(['data']);
            expect(fixSendNewsletter.meta).toEqual(['data']);
        });

        it('should set tools.analytics', () => {
            fixSendNewsletter.setMeta({ pagination: { total_count: 123 } });
            expect(tools.analytics['fix-send-newsletter']).toEqual(123);
        });
    });

    describe('save', () => {
        let contact;

        beforeEach(() => {
            contact = { id: 'contact_id', send_newsletter: 'Physical' };
            spyOn(contacts, 'save').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixSendNewsletter.save(contact)).toEqual(jasmine.any(Promise));
        });

        it('should call the contacts service', () => {
            fixSendNewsletter.save(contact);
            expect(contacts.save).toHaveBeenCalledWith(
                {
                    id: 'contact_id',
                    send_newsletter: 'Physical'
                });
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(fixSendNewsletter, 'removeContactFromData').and.returnValue();
            });

            it('should call load', (done) => {
                fixSendNewsletter.save(contact).then(() => {
                    expect(fixSendNewsletter.removeContactFromData).toHaveBeenCalledWith('contact_id');
                    done();
                });
            });
        });
    });

    describe('removeContactFromData', () => {
        let contact;

        beforeEach(() => {
            fixSendNewsletter.data = [{ id: 'contact_id' }];
            fixSendNewsletter.page = 1;
            fixSendNewsletter.meta = { pagination: { total_count: 2 } };
            contact = fixSendNewsletter.data[0];
        });

        it('should remove contact from data', () => {
            fixSendNewsletter.removeContactFromData(contact.id);
            expect(fixSendNewsletter.data).toEqual([]);
        });

        it('should subtract 1 from the total_count', () => {
            fixSendNewsletter.removeContactFromData(contact.id);
            expect(fixSendNewsletter.meta.pagination.total_count).toEqual(1);
        });

        it('should call setMeta', () => {
            spyOn(fixSendNewsletter, 'setMeta').and.callThrough();
            fixSendNewsletter.removeContactFromData(contact.id);
            expect(fixSendNewsletter.setMeta).toHaveBeenCalled();
        });

        describe('data empty', () => {
            beforeEach(() => {
                spyOn(fixSendNewsletter, 'load').and.callFake(() => Promise.resolve());
            });

            it('should call load', () => {
                fixSendNewsletter.removeContactFromData(contact.id);
                expect(fixSendNewsletter.load).toHaveBeenCalledWith(true, 1);
            });
        });

        describe('data not empty', () => {
            beforeEach(() => {
                spyOn(fixSendNewsletter, 'load').and.returnValue();
                fixSendNewsletter.data.push({ id: 'contact_id_1' });
            });

            it('should not call load', () => {
                fixSendNewsletter.removeContactFromData(contact.id);
                expect(fixSendNewsletter.load).not.toHaveBeenCalled();
            });
        });
    });

    describe('bulkSave', () => {
        beforeEach(() => {
            fixSendNewsletter.data = [{
                id: 'contact_id_0',
                send_newsletter: 'None'
            }, {
                id: 'contact_id_1',
                send_newsletter: 'Physical'
            }, {
                id: 'contact_id_2'
            }];
            spyOn(contacts, 'bulkSave').and.callFake(() => Promise.resolve());
        });

        it('should return a promise', () => {
            expect(fixSendNewsletter.bulkSave('MPDX')).toEqual(jasmine.any(Promise));
        });

        it('should call the contacts service', () => {
            fixSendNewsletter.bulkSave();
            expect(contacts.bulkSave).toHaveBeenCalledWith(
                [{
                    id: 'contact_id_0',
                    send_newsletter: 'None'
                }, {
                    id: 'contact_id_1',
                    send_newsletter: 'Physical'
                }]
            );
        });

        it('should set loading to true', () => {
            fixSendNewsletter.bulkSave();
            expect(fixSendNewsletter.loading).toBeTruthy();
        });

        describe('promise successful', () => {
            beforeEach(() => {
                spyOn(fixSendNewsletter, 'load').and.callFake(() => Promise.resolve());
            });

            it('should call load', (done) => {
                fixSendNewsletter.bulkSave().then(() => {
                    expect(fixSendNewsletter.load).toHaveBeenCalledWith(true);
                    done();
                });
            });
        });
    });
});
