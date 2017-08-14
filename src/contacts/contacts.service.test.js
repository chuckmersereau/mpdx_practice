import service from './contacts.service';
import assign from 'lodash/fp/assign';
import moment from 'moment';

const accountListId = 123;
const defaultParams = {};
const params = {a: 'b'};
const tags = [{name: 'a'}, {name: 'b'}];

describe('contacts.service', () => {
    let api, contacts, contactFilter, contactsTags, rootScope;
    beforeEach(() => {
        angular.mock.module(service);
        inject(($rootScope, _api_, _contacts_, _contactFilter_, _contactsTags_) => {
            rootScope = $rootScope;
            api = _api_;
            contacts = _contacts_;
            contactFilter = _contactFilter_;
            contactsTags = _contactsTags_;
            api.account_list_id = accountListId;
        });
        spyOn(api, 'put').and.callFake(data => Promise.resolve(data));
        spyOn(rootScope, '$emit').and.callThrough();
    });
    describe('buildFilterParams', () => {
        const defaultResult = assign(params, {account_list_id: accountListId, any_tags: false});
        beforeEach(() => {
            contactFilter.default_params = defaultParams;
            contactFilter.params = params;
        });
        it('should handle default params', () => {
            expect(contacts.buildFilterParams()).toEqual(defaultResult);
        });
        it('should handle wildcard search', () => {
            contactFilter.wildcard_search = 'abc';
            expect(contacts.buildFilterParams()).toEqual(assign(defaultResult, {wildcard_search: 'abc'}));
            contactFilter.wildcard_search = null;
        });
        it('should handle tags', () => {
            contactsTags.selectedTags = tags;
            expect(contacts.buildFilterParams()).toEqual(assign(defaultResult, {tags: 'a,b'}));
            contactFilter.selectedTags = [];
        });
        it('should handle tag exclusions', () => {
            contactsTags.rejectedTags = tags;
            expect(contacts.buildFilterParams()).toEqual(assign(defaultResult, {exclude_tags: 'a,b'}));
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
                        contacts: 'avatar,church_name,envelope_greeting,greeting,last_donation,lifetime_donations,' +
                                  'likely_to_give,locale,magazine,name,no_appeals,notes,notes_saved_at,pledge_amount,' +
                                  'pledge_currency,pledge_currency_symbol,pledge_frequency,pledge_received,' +
                                  'pledge_start_date,send_newsletter,square_avatar,status,status_valid,suggested_changes,' +
                                  'tag_list,timezone,website,addresses,contact_referrals_by_me,contact_referrals_to_me,' +
                                  'contacts_that_referred_me,donor_accounts,primary_person,no_gift_aid',
                        addresses: 'city,country,created_at,end_date,geo,historic,location,metro_area,postal_code,' +
                                   'primary_mailing_address,region,remote_id,seasonal,source,start_date,state,street,' +
                                   'updated_at,updated_in_db_at,valid_values',
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
        it('should parse pledge_frequency for value consistency', done => {
            contacts.get(123).then(data => {
                expect(data.pledge_frequency).toEqual(1.1);
                done();
            });
        });
    });
    describe('getNames', () => {
        it('should query an array of ids for names', () => {
            spyOn(api, 'get').and.callFake(data => Promise.resolve(data));
            contacts.getNames([1, 2]);
            expect(api.get).toHaveBeenCalledWith('contacts', {
                fields: { contacts: 'name' },
                filter: { ids: '1,2' }
            });
        });
    });
    describe('save', () => {
        let contact = {id: 1, name: 'a'};
        it('should save a contact', () => {
            contacts.save(contact);
            expect(api.put).toHaveBeenCalledWith(`contacts/${contact.id}`, contact);
        });
        it('should change tag_list array to comma delim list', () => {
            contact.tag_list = ['tag1', 'tag2'];
            contacts.save(contact);
            expect(api.put).toHaveBeenCalledWith(`contacts/${contact.id}`, assign(contact, {tag_list: 'tag1,tag2'}));
        });
        it('should trigger contactCreated if name changed', done => {
            contacts.save(contact).then(() => {
                expect(rootScope.$emit).toHaveBeenCalledWith('contactCreated');
                done();
            });
        });
        it('should return the server response', done => {
            contacts.save(contact).then(data => {
                expect(data).toBeDefined();
                done();
            });
        });
    });
    describe('getAnalytics', () => {
        beforeEach(() => {
            contacts.analytics = null;
        });
        it('should return cached value if not a reset', done => {
            const data = ['data'];
            contacts.analytics = data;
            contacts.getAnalytics().then(retval => {
                expect(retval).toEqual(data);
                done();
            });
        });
        it('should query the api', () => {
            spyOn(api, 'get').and.callFake(() => Promise.resolve());
            contacts.getAnalytics();
            expect(api.get).toHaveBeenCalledWith({
                url: 'contacts/analytics',
                data: {
                    include: 'anniversaries_this_week,' +
                    'anniversaries_this_week.people,' +
                    'anniversaries_this_week.people.facebook_accounts,' +
                    'anniversaries_this_week.people.twitter_accounts,' +
                    'anniversaries_this_week.people.email_addresses,' +
                    'birthdays_this_week,' +
                    'birthdays_this_week.facebook_accounts,' +
                    'birthdays_this_week.twitter_accounts,' +
                    'birthdays_this_week.email_addresses',
                    fields: {
                        contacts: 'people',
                        people: 'anniversary_day,anniversary_month,anniversary_year,birthday_day,birthday_month,birthday_year,facebook_accounts,first_name,last_name,twitter_accounts,email_addresses,parent_contact',
                        email_addresses: 'email,primary',
                        facebook_accounts: 'username',
                        twitter_accounts: 'screen_name'
                    },
                    filter: {account_list_id: api.account_list_id}
                },
                deSerializationOptions: jasmine.any(Object), //for parent_contact
                beforeDeserializationTransform: jasmine.any(Function),
                overrideGetAsPost: true
            });
        });
        it('should transform birthdays and anniversaries to dates', done => {
            const transformable = {
                birthdays_this_week: [{
                    birthday_year: 2015,
                    birthday_day: 1,
                    birthday_month: 1
                }],
                anniversaries_this_week: [{
                    people: [{
                        anniversary_year: 2015,
                        anniversary_day: 1,
                        anniversary_month: 1
                    }]
                }]
            };
            spyOn(api, 'get').and.callFake(() => Promise.resolve(transformable));
            contacts.getAnalytics().then(data => {
                expect(moment(contacts.analytics.birthdays_this_week[0].birthday_date).format('M-D-YYYY')).toEqual('1-1-2015');
                expect(moment(contacts.analytics.anniversaries_this_week[0].people[0].anniversary_date).format('M-D-YYYY')).toEqual('1-1-2015');
                expect(data).toEqual(contacts.analytics);
                done();
            });
        });
    });
    it('should handle bad birthdays and anniversaries', done => {
        const transformable = {
            birthdays_this_week: [{
                birthday_year: 6,
                birthday_day: 1,
                birthday_month: 1
            }, null],
            anniversaries_this_week: [{
                people: [{
                    anniversary_year: 15,
                    anniversary_day: 1,
                    anniversary_month: 1
                }]
            }, null]
        };
        spyOn(api, 'get').and.callFake(() => Promise.resolve(transformable));
        contacts.getAnalytics().then(() => {
            expect(contacts.analytics.birthdays_this_week).toEqual([]);
            expect(contacts.analytics.anniversaries_this_week).toEqual([]);
            done();
        });
    });
    describe('merge', () => {
        it('should post to api', () => {
            spyOn(api, 'post').and.callFake(() => Promise.resolve());
            contacts.merge('a');
            expect(api.post).toHaveBeenCalledWith({url: `contacts/merges/bulk`, data: 'a', type: 'contacts'});
        });
        it('should return data', done => {
            let data = {success: () => 'a'};
            spyOn(data, 'success').and.callThrough();
            spyOn(api, 'post').and.callFake(() => Promise.resolve(data));
            contacts.merge('a').then(resp => {
                expect(resp).toEqual(data);
                done();
            });
        });
        it('should call a success fn', done => {
            let data = {success: () => 'a'};
            spyOn(data, 'success').and.callThrough();
            spyOn(api, 'post').and.callFake(() => Promise.resolve(data));
            contacts.merge('a').then(() => {
                expect(data.success).toHaveBeenCalledWith();
                done();
            });
        });
    });
});
