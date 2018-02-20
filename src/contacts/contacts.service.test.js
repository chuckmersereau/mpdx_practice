import service from './contacts.service';
import { assign } from 'lodash/fp';

const accountListId = 123;
const defaultParams = {};
const params = { a: 'b' };
const tags = [{ name: 'a' }, { name: 'b' }];

describe('contacts.service', () => {
    let api, contacts, contactFilter, contactsTags, rootScope, modal, serverConstants;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _contacts_, _contactFilter_, _contactsTags_, _modal_, _serverConstants_) => {
            rootScope = $rootScope;
            api = _api_;
            contacts = _contacts_;
            contactFilter = _contactFilter_;
            contactsTags = _contactsTags_;
            modal = _modal_;
            serverConstants = _serverConstants_;
            api.account_list_id = accountListId;
        });
        spyOn(api, 'put').and.callFake((data) => Promise.resolve(data));
        spyOn(rootScope, '$emit').and.callThrough();
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
            contactFilter.wildcard_search = 'abc';
            expect(contacts.buildFilterParams()).toEqual(assign(defaultResult, { wildcard_search: 'abc' }));
            contactFilter.wildcard_search = null;
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
            spyOn(api, 'get').and.returnValue(Promise.resolve(data));
        });
        it('should call the api with a contact id', () => {
            contacts.get(123);
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts/123',
                data: {
                    include: 'addresses,donor_accounts,primary_person,contact_referrals_to_me',
                    fields: {
                        contacts: 'avatar,church_name,envelope_greeting,greeting,last_donation,lifetime_donations,'
                                  + 'likely_to_give,locale,magazine,name,no_appeals,notes,notes_saved_at,pledge_amount,'
                                  + 'pledge_currency,pledge_currency_symbol,pledge_frequency,pledge_received,'
                                  + 'pledge_start_date,send_newsletter,square_avatar,status,status_valid,suggested_changes,'
                                  + 'tag_list,timezone,website,addresses,contact_referrals_by_me,contact_referrals_to_me,'
                                  + 'contacts_that_referred_me,donor_accounts,primary_person,no_gift_aid,timezone',
                        addresses: 'city,country,created_at,end_date,geo,historic,location,metro_area,postal_code,'
                                   + 'primary_mailing_address,region,remote_id,seasonal,source,start_date,state,street,'
                                   + 'updated_at,updated_in_db_at,valid_values',
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
            expect(contacts.get(123)).toEqual(jasmine.any(Promise));
        });
        it('should set pledge_amount to float', (done) => {
            contacts.get(123).then((data) => {
                expect(data.pledge_amount).toEqual(100.1);
                done();
            });
        });
        it('should parse pledge_frequency for value consistency', (done) => {
            contacts.get(123).then((data) => {
                expect(data.pledge_frequency).toEqual(1.1);
                done();
            });
        });
    });
    describe('getRecommendation', () => {
        let data;
        beforeEach(() => {
            data = [
                { id: 'recommendation_id' }
            ];
            spyOn(api, 'get').and.callFake(() => Promise.resolve(data));
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
            expect(contacts.getRecommendation(123)).toEqual(jasmine.any(Promise));
        });

        describe('promise successful', () => {
            it('should return first array recommendation', (done) => {
                contacts.getRecommendation(123).then((data) => {
                    expect(data).toEqual({ id: 'recommendation_id' });
                    done();
                });
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
                });
            });
        });
    });
    describe('save', () => {
        let contact = { id: 1, name: 'a' };
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
        });
        it('should return the server response', (done) => {
            contacts.save(contact).then((data) => {
                expect(data).toBeDefined();
                done();
            });
        });
    });
    describe('merge', () => {
        it('should post to api', () => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            contacts.merge('a');
            expect(api.post).toHaveBeenCalledWith({ url: 'contacts/merges/bulk', data: 'a', type: 'contacts' });
        });
        it('should return data', (done) => {
            let data = { success: () => 'a' };
            spyOn(data, 'success').and.callThrough();
            spyOn(api, 'post').and.callFake(() => Promise.resolve(data));
            contacts.merge('a').then((resp) => {
                expect(resp).toEqual(data);
                done();
            });
        });
        it('should call a success fn', (done) => {
            let data = { success: () => 'a' };
            spyOn(data, 'success').and.callThrough();
            spyOn(api, 'post').and.callFake(() => Promise.resolve(data));
            contacts.merge('a').then(() => {
                expect(data.success).toHaveBeenCalledWith();
                done();
            });
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
            spyOn(api, 'get').and.callFake(() => Promise.resolve(null));
        });
        it('should call the api', () => {
            contacts.getEmails();
            expect(api.get).toHaveBeenCalledWith('contacts', {
                filter: { account_list_id: 123, newsletter: 'email', status: 'active' },
                include: 'people,people.email_addresses',
                fields: {
                    contact: 'people',
                    people: 'deceased,email_addresses',
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
        });
    });

    describe('mapEmails', () => {
        const data = [
            { people: [{ email_addresses: [{ primary: true, email: 'a' }] }] },
            { people: [{ email_addresses: [{ email: 'b' }] }] },
            { people: [{ deceased: true, email_addresses: [{ primary: true, email: 'b' }] }] },
            { people: [{ email_addresses: [{ email: 'c' }, { email: 'd', primary: true }] }] }
        ];
        it('should map primary emails from contacts', () => {
            expect(contacts.mapEmails(data)).toEqual('a,d');
        });
    });
});
