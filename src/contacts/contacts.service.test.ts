import { assign } from 'lodash/fp';
import service from './contacts.service';

const accountListId = 123;
const defaultParams = {};
const params = { a: 'b' };
const tags = [{ name: 'a' }, { name: 'b' }];

describe('contacts.service', () => {
    let api, contacts, contactFilter, contactsTags, rootScope, modal, serverConstants, q, gettextCatalog;
    beforeEach(() => {
        angular.mock.module(service);
        inject((
            $rootScope, _api_, _contacts_, _contactFilter_, _contactsTags_, _modal_, _serverConstants_, $q,
            _gettextCatalog_
        ) => {
            rootScope = $rootScope;
            api = _api_;
            contacts = _contacts_;
            contactFilter = _contactFilter_;
            contactsTags = _contactsTags_;
            modal = _modal_;
            serverConstants = _serverConstants_;
            q = $q;
            api.account_list_id = accountListId;
            gettextCatalog = _gettextCatalog_;
        });
        spyOn(api, 'put').and.callFake((data) => q.resolve(data));
        spyOn(rootScope, '$emit').and.callThrough();
        spyOn(gettextCatalog, 'getString').and.callThrough();
    });

    describe('constructor', () => {
        it('should set default contact drawer', () => {
            expect(contacts.activeDrawer).toEqual('details');
            expect(contacts.activeTab).toEqual('donations');
        });
    });

    describe('buildFilterParams', () => {
        const defaultResult = assign(params, { account_list_id: accountListId, any_tags: false });
        beforeEach(() => {
            contactFilter.default_params = defaultParams;
            contactFilter.params = params;
        });

        it('should handle default params', () => {
            expect(contacts.buildFilterParams()).toEqual(defaultResult);
        });

        it('should handle wildcard search', () => {
            contactFilter.wildcardSearch = 'abc';
            expect(contacts.buildFilterParams()).toEqual(assign(defaultResult, { wildcard_search: 'abc' }));
            contactFilter.wildcardSearch = null;
        });

        it('should handle tags', () => {
            contactsTags.selectedTags = tags;
            expect(contacts.buildFilterParams()).toEqual(assign(defaultResult, { tags: 'a,b' }));
            contactFilter.selectedTags = [];
        });

        it('should handle tag exclusions', () => {
            contactsTags.rejectedTags = tags;
            expect(contacts.buildFilterParams()).toEqual(assign(defaultResult, { exclude_tags: 'a,b' }));
            contactFilter.rejectedTags = [];
        });
    });

    describe('get', () => {
        beforeEach(() => {
            const data = {
                pledge_amount: '100.1',
                pledge_frequency: '1.1'
            };
            spyOn(api, 'get').and.returnValue(q.resolve(data));
        });

        it('should call the api with a contact id', () => {
            contacts.get(123);
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts/123',
                data: {
                    include: 'addresses,donor_accounts,primary_person,contact_referrals_to_me',
                    fields: {
                        contacts: 'avatar,church_name,envelope_greeting,greeting,last_donation,lifetime_donations,'
                                  + 'likely_to_give,locale,magazine,name,next_ask,no_appeals,notes,notes_saved_at,'
                                  + 'pledge_amount,pledge_currency,pledge_currency_symbol,pledge_frequency,pledge_received,'
                                  + 'pledge_start_date,send_newsletter,square_avatar,status,status_valid,suggested_changes,'
                                  + 'tag_list,timezone,website,addresses,contact_referrals_by_me,contact_referrals_to_me,'
                                  + 'contacts_that_referred_me,donor_accounts,primary_person,no_gift_aid,timezone',
                        addresses: 'city,country,created_at,end_date,geo,historic,location,metro_area,postal_code,'
                                   + 'primary_mailing_address,region,remote_id,seasonal,source,source_donor_account,'
                                   + 'start_date,state,street,updated_at,updated_in_db_at,valid_values',
                        donor_accounts: 'account_number'
                    }
                },
                deSerializationOptions: {
                    contacts: { valueForRelationship: jasmine.any(Function) },
                    people: { valueForRelationship: jasmine.any(Function) }
                }
            });
        });

        it('should return promise', () => {
            expect(contacts.get(123)).toEqual(jasmine.any(q));
        });

        it('should set pledge_amount to float', (done) => {
            contacts.get(123).then((data) => {
                expect(data.pledge_amount).toEqual(100.1);
                done();
            });
            rootScope.$digest();
        });

        it('should parse pledge_frequency for value consistency', (done) => {
            contacts.get(123).then((data) => {
                expect(data.pledge_frequency).toEqual(1.1);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('getRecommendation', () => {
        let data;
        beforeEach(() => {
            data = [
                { id: 'recommendation_id' }
            ];
            spyOn(api, 'get').and.callFake(() => q.resolve(data));
        });

        it('should call the api', () => {
            contacts.getRecommendation(123);
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts/123/donation_amount_recommendations',
                data: {
                    page: 1,
                    per_page: 1
                }
            }
            );
        });

        it('should return promise', () => {
            expect(contacts.getRecommendation(123)).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should return first array recommendation', (done) => {
                contacts.getRecommendation(123).then((data) => {
                    expect(data).toEqual({ id: 'recommendation_id' });
                    done();
                });
                rootScope.$digest();
            });

            describe('data empty', () => {
                beforeEach(() => {
                    data = [
                    ];
                });

                it('should return null', (done) => {
                    contacts.getRecommendation(123).then((data) => {
                        expect(data).not.toBeDefined();
                        done();
                    });
                    rootScope.$digest();
                });
            });
        });
    });

    describe('getPrimaryPerson', () => {
        let data;
        beforeEach(() => {
            data = {
                primary_person: {
                    id: 'person_id'
                }
            };
            spyOn(api, 'get').and.callFake(() => q.resolve(data));
        });

        it('should call the api', () => {
            contacts.getPrimaryPerson(123);
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts/123',
                data: {
                    include: 'primary_person,people.email_addresses,people.phone_numbers',
                    fields: {
                        contacts: 'primary_person',
                        people: 'first_name,last_name,phone_numbers,email_addresses',
                        phone_numbers: 'primary,historic,number',
                        email_addresses: 'primary,historic,email'
                    }
                }
            }
            );
        });

        it('should return promise', () => {
            expect(contacts.getPrimaryPerson(123)).toEqual(jasmine.any(q));
        });

        describe('promise successful', () => {
            it('should return the primary person', (done) => {
                contacts.getPrimaryPerson(123).then((data) => {
                    expect(data).toEqual({ id: 'person_id' });
                    done();
                });
                rootScope.$digest();
            });

            describe('data empty', () => {
                beforeEach(() => {
                    data = {
                        primary_person: null
                    };
                });

                it('should return null', (done) => {
                    contacts.getRecommendation(123).then((data) => {
                        expect(data).not.toBeDefined();
                        done();
                    });
                    rootScope.$digest();
                });
            });
        });
    });

    describe('save', () => {
        let contact: any = { id: 1, name: 'a' };
        it('should save a contact', () => {
            contacts.save(contact);
            expect(api.put).toHaveBeenCalledWith(`contacts/${contact.id}`, contact, undefined, undefined);
        });

        it('should change tag_list array to comma delim list', () => {
            contact.tag_list = ['tag1', 'tag2'];
            contacts.save(contact);
            expect(api.put).toHaveBeenCalledWith(`contacts/${contact.id}`, assign(contact, { tag_list: 'tag1,tag2' }), undefined, undefined);
        });

        it('should trigger contactCreated if name changed', (done) => {
            contacts.save(contact).then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('contactCreated');
                done();
            });
            rootScope.$digest();
        });

        it('should return the server response', (done) => {
            contacts.save(contact).then((data) => {
                expect(data).toBeDefined();
                done();
            });
            rootScope.$digest();
        });
    });

    describe('merge', () => {
        it('should post to api', () => {
            spyOn(api, 'post').and.callFake(() => q.resolve());
            contacts.merge('a');
            expect(api.post).toHaveBeenCalledWith({ url: 'contacts/merges/bulk', data: 'a', type: 'contacts' });
        });

        it('should return data', (done) => {
            let data = { success: () => 'a' };
            spyOn(data, 'success').and.callThrough();
            spyOn(api, 'post').and.callFake(() => q.resolve(data));
            contacts.merge('a').then((resp) => {
                expect(resp).toEqual(data);
                done();
            });
            rootScope.$digest();
        });

        it('should call a success fn', (done) => {
            let data = { success: () => 'a' };
            spyOn(data, 'success').and.callThrough();
            spyOn(api, 'post').and.callFake(() => q.resolve(data));
            contacts.merge('a').then(() => {
                expect(data.success).toHaveBeenCalledWith();
                done();
            });
            rootScope.$digest();
        });
    });

    describe('openAddTagModal', () => {
        it('should open the add tag modal', () => {
            spyOn(modal, 'open').and.callFake(() => {});
            contacts.openAddTagModal([1, 2]);
            expect(modal.open).toHaveBeenCalledWith({
                template: require('./sidebar/filter/tags/add/add.html'),
                controller: 'addTagController',
                locals: {
                    selectedContacts: [1, 2]
                }
            });
        });
    });

    describe('fixPledgeAmountAndFrequencies', () => {
        const data = [{ pledge_frequency: null, pledge_amount: null }, { pledge_frequency: '1', pledge_amount: '1' }];
        it('should mutate contact values', () => {
            spyOn(serverConstants, 'getPledgeFrequencyValue').and.callFake(() => 1);
            expect(contacts.fixPledgeAmountAndFrequencies(data)).toEqual([
                { pledge_frequency: null, pledge_amount: null },
                { pledge_frequency: 1, pledge_amount: 1 }
            ]);
        });
    });

    describe('getEmails', () => {
        beforeEach(() => {
            spyOn(contacts, 'mapEmails').and.callFake(() => 'a');
            spyOn(api, 'get').and.callFake(() => q.resolve(null));
        });

        it('should call the api', () => {
            contacts.getEmails();
            expect(api.get).toHaveBeenCalledWith('contacts', {
                filter: { account_list_id: 123, newsletter: 'email', status: 'active' },
                include: 'people,people.email_addresses',
                fields: {
                    contact: 'people',
                    people: 'deceased,email_addresses,optout_enewsletter',
                    email_addresses: 'email,primary'
                },
                per_page: 25000
            }, undefined, undefined);
        });

        it('should map data to emails', (done) => {
            contacts.getEmails().then((data) => {
                expect(data).toEqual('a');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('addBulk', () => {
        const contactArr = [{ id: 1 }, { id: 2 }];
        beforeEach(() => {
            spyOn(api, 'post').and.callFake(() => q.resolve());
        });

        it('should call api post', () => {
            contacts.addBulk(contactArr);
            expect(api.post).toHaveBeenCalledWith({
                url: 'contacts/bulk',
                data: contactArr,
                type: 'contacts',
                fields: {
                    contacts: ''
                }
            });
        });

        it('should emit a complete event', (done) => {
            contacts.addBulk(contacts).then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('contactCreated');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('hideContact', () => {
        const contact: any = { id: 'contact_id', prop: 'junk' };
        const msg: string = 'Are you sure you wish to hide the selected contact? Hiding a contact in MPDX actually sets the contact status to "Never Ask".';
        const status: string = 'Never Ask';
        beforeEach(() => {
            spyOn(modal, 'confirm').and.callFake(() => q.resolve());
            spyOn(contacts, 'save').and.callFake(() => q.resolve());
        });

        it('should translate a message', () => {
            contacts.hideContact(contact);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(msg);
            rootScope.$digest();
        });

        it('should open a confirmation modal', () => {
            contacts.hideContact(contact);
            expect(modal.confirm).toHaveBeenCalledWith(msg);
            rootScope.$digest();
        });

        it('should call save', (done) => {
            contacts.hideContact(contact).then(() => {
                expect(contacts.save).toHaveBeenCalledWith({ id: contact.id, status: status });
                done();
            });
            rootScope.$digest();
        });

        it('should set the return contact status', (done) => {
            contacts.hideContact(contact).then(() => {
                expect(contact.status).toEqual(status);
                done();
            });
            rootScope.$digest();
        });

        it('should emit change', (done) => {
            contacts.hideContact(contact).then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('contactHidden', contact.id);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('saveCurrent', () => {
        beforeEach(() => {
            contacts.current = { id: 1, name: 'a' };
            contacts.initialState = { id: 1 };
            spyOn(contactsTags, 'addTag').and.callFake(() => {});
        });

        it('should call save', () => {
            spyOn(contacts, 'save').and.callFake(() => q.resolve());
            contacts.saveCurrent();
            const errorMessage = 'Unable to save changes.';
            const successMessage = 'Changes saved successfully.';
            expect(gettextCatalog.getString).toHaveBeenCalledWith(errorMessage);
            expect(gettextCatalog.getString).toHaveBeenCalledWith(successMessage);
            expect(contacts.save).toHaveBeenCalledWith({ id: 1, name: 'a' }, successMessage, errorMessage);
        });

        it('shouldn\'t broadcast if tag_list is unchanged', (done) => {
            spyOn(contacts, 'save').and.callFake(() => q.resolve());
            contacts.saveCurrent().then(() => {
                expect(rootScope.$emit).not.toHaveBeenCalled();
                done();
            });
            rootScope.$digest();
        });

        it('should broadcast if tag_list changed', (done) => {
            contacts.current = assign(contacts.current, { tag_list: 'a,b' });
            spyOn(contacts, 'save').and.callFake(() => q.resolve());
            contacts.saveCurrent().then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('contactTagsAdded', { tags: ['a', 'b'] });
                expect(contactsTags.addTag).toHaveBeenCalledWith({ tags: ['a', 'b'] });
                done();
            });
            rootScope.$digest();
        });

        it('should update initialState', (done) => {
            contacts.initialState.no_gift_aid = false;
            contacts.current.no_gift_aid = true;
            spyOn(contacts, 'save').and.callFake(() => q.resolve());
            contacts.saveCurrent().then(() => {
                expect(contacts.initialState.no_gift_aid).toEqual(true);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('findChangedFilters', () => {
        const defaultParams = { a: '1', b: '2', c: ['active'], d: ['null'], e: { a: '' }, f: { a: '' } };
        const params = { a: '2', b: ['null'], c: { text: 'space' } };
        const difference = { a: '2', b: ['null'], c: { text: 'space' } };

        it('should find changed filters', () => {
            expect(contacts.findChangedFilters(defaultParams, params)).toEqual(difference);
        });
    });

    describe('mapEmails', () => {
        const data = [
            { people: [{ optout_enewsletter: true, email_addresses: [{ primary: true, email: 'a' }] }] },
            { people: [{ email_addresses: [{ email: 'b' }] }] },
            { people: [{ deceased: true, email_addresses: [{ primary: true, email: 'b' }] }] },
            { people: [{ email_addresses: [{ email: 'c' }, { email: 'd', primary: true }] }] }
        ];
        it('should map primary emails from contacts', () => {
            expect(contacts.mapEmails(data)).toEqual('d');
        });
    });
});
