import service, { EntityAttributes } from './api.service';

const jsonApiResponse = {
    data: {
        id: 234
    }
};

const transformedResponse = {
    id: 234
};

const jsonApiErrorResponse = {
    errors: [{
        status: 'bad_request',
        source: { pointer: '/data/attributes/updated_in_db_at' },
        title: 'has to be sent in the list of attributes in order to update resource',
        detail: 'Updated in db at has to be sent in the list of attributes in order to update resource'
    }]
};

describe('common.api.service', () => {
    let api, $httpBackend;
    beforeEach(() => {
        angular.mock.module(service);
        inject((_api_, _$httpBackend_) => {
            api = _api_;
            $httpBackend = _$httpBackend_;
        });
    });
    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('call', () => {
        describe('promise', () => {
            it('should send a simple get request', () => {
                $httpBackend.expectGET('/api/v1/contacts').respond(200, jsonApiResponse);

                api.get('contacts').then((data) => {
                    expect(data).toEqual(transformedResponse);
                }).catch(() => {
                    fail('should have returned Success');
                });
                $httpBackend.flush();
            });
            it('should handle an error in a get request', () => {
                $httpBackend.expectGET('/api/v1/contacts').respond(500, jsonApiErrorResponse);

                api.get('contacts').then(() => {
                    fail('should have returned an error');
                }).catch((response) => {
                    expect(response.status).toEqual(500);
                });
                $httpBackend.flush();
            });
        });
    });

    describe('get', () => {
        it('should send a simple get request', () => {
            $httpBackend.expectGET('/api/v1/contacts').respond(200, jsonApiResponse);

            api.get('contacts').then((data) => {
                expect(data).toEqual(transformedResponse);
            }).catch(() => {
                fail('should have returned Success');
            });
            $httpBackend.flush();
        });
    });

    describe('post', () => {
        it('should send a simple post request', () => {
            $httpBackend.expectPOST('/api/v1/contacts').respond(200, jsonApiResponse);

            api.post('contacts').then((data) => {
                expect(data).toEqual(transformedResponse);
            }).catch(() => {
                fail('should have returned Success');
            });
            $httpBackend.flush();
        });
    });

    describe('encodeURLarray', () => {
        it('should encode an array of values', () => {
            expect(api.encodeURLarray(['handles spaces', '?&'])).toEqual([ 'handles%20spaces', '%3F%26' ]);
        });
    });
    describe('EntityAttributes', () => {
        const attributes = new EntityAttributes().attributes;
        it('should define account_list_invites', () => {
            expect(attributes.account_list_invites).toEqual({
                attributes: [
                    'accepted_at', 'accepted_by_user_id', 'account_list_id', 'cancelled_by_user_id', 'code',
                    'created_at', 'invited_by_user_id', 'recipient_email', 'updated_at'
                ]
            });
        });
        it('should define account_lists', () => {
            expect(attributes.account_lists).toEqual({
                attributes: [
                    'creator_id', 'created_at', 'currency', 'home_country', 'monthly_goal', 'name',
                    'notification_preferences', 'settings', 'salary_organization', 'tester', 'total_pledges',
                    'updated_at'
                ],
                notification_preferences: {
                    ref: 'id',
                    attributes: ['actions', 'notification_type'],
                    notification_type: { ref: 'id' }
                }
            });
        });
        it('should define addresses', () => {
            expect(attributes.addresses).toEqual({
                attributes: [
                    'city', 'country', 'end_date', 'geo', 'historic', 'location', 'metro_area', 'postal_code',
                    'primary_mailing_address', 'region', 'start_date', 'state', 'street', 'valid_values'
                ]
            });
        });
        it('should define appeals', () => {
            expect(attributes.appeals).toEqual({
                attributes: [
                    'account_list', 'amount', 'contacts', 'created_at', 'currencies', 'description', 'donations',
                    'end_date', 'name', 'total_currency', 'contact_statuses', 'contact_tags', 'contact_exclude',
                    'tag_list', 'updated_at'
                ],
                account_list: { ref: 'id' }
            });
        });
        it('should define bulk', () => {
            expect(attributes.bulk).toEqual({
                attributes: ['tag_name'],
                pluralizeType: false
            });
        });
        it('should define comments', () => {
            expect(attributes.comments).toEqual({
                attributes: ['body', 'person'],
                person: { ref: 'id', pluralizeType: false }
            });
        });
        it('should define contacts', () => {
            expect(attributes.contacts).toEqual({
                attributes: [
                    'account_list', 'addresses', 'church_name', 'contacts_referred_by_me', 'contact_referrals_to_me',
                    'created_at', 'direct_deposit', 'donor_accounts', 'envelope_greeting', 'first_donation_date',
                    'full_name', 'greeting', 'last_activity', 'last_appointment', 'last_donation_date', 'last_letter',
                    'likely_to_give', 'last_phone_call', 'last_pre_call', 'last_thank', 'late_at', 'locale', 'loser_id',
                    'magazine', 'name', 'next_ask', 'no_appeals', 'no_gift_aid', 'not_duplicated_with', 'notes',
                    'notes_saved_at', 'people', 'pledge_amount', 'pledge_currency', 'pledge_frequency',
                    'pledge_received', 'pledge_start_date', 'pls_id', 'prayer_letters_id', 'prayer_letters_params',
                    'primary_person', 'send_newsletter', 'status', 'status_valid', 'tag_list', 'timezone', 'tnt_id',
                    'total_donations', 'uncompleted_tasks_count', 'updated_at', 'website', 'winner_id'
                ],
                addresses: {
                    ref: 'id',
                    attributes: [
                        'city', 'historic', 'postal_code', 'state', 'street', 'primary_mailing_address', 'metro_area',
                        'valid_values', '_destroy'
                    ]
                },
                people: {
                    ref: 'id',
                    attributes: ['email_addresses', 'first_name', 'last_name', 'phone_numbers'],
                    email_addresses: {
                        ref: 'id',
                        attributes: ['email', 'primary', 'source', 'valid_values', '_destroy']
                    },
                    phone_numbers: {
                        ref: 'id',
                        attributes: ['number', 'primary', 'source', 'valid_values', '_destroy']
                    }
                },
                primary_person: {
                    ref: 'id'
                },
                donor_accounts: {
                    ref: 'id',
                    attributes: ['account_number', 'organization', '_destroy'],
                    organization: { ref: 'id' }
                },
                account_list: { ref: 'id' },
                contacts_referred_by_me: {
                    ref: 'id',
                    attributes: [
                        'account_list', 'name', 'primary_person_first_name', 'primary_person_last_name',
                        'primary_person_email', 'primary_person_phone', 'notes',
                        'spouse_first_name', 'spouse_last_name', 'spouse_phone', 'spouse_email',
                        'primary_address_city', 'primary_address_state', 'primary_address_postal_code',
                        'primary_address_street', 'name', 'created_at'
                    ],
                    account_list: { ref: 'id' }
                },
                contact_referrals_to_me: {
                    ref: 'id',
                    attributes: ['referred_by'],
                    contacts: { ref: 'id' }
                },
                typeForAttribute: jasmine.any(Function)
            });
        });
        it('should define donations', () => {
            expect(attributes.donations).toEqual({
                attributes: [
                    'amount', 'appeal', 'appeal_amount', 'channel', 'created_at', 'designation_account',
                    'donation_date', 'donor_account', 'motivation', 'payment_method', 'payment_type', 'remote_id',
                    'tendered_currency', 'tendered_amount', 'currency', 'memo', 'updated_at'
                ],
                designation_account: { ref: 'id' },
                donor_account: { ref: 'id' },
                appeal: { ref: 'id' }
            });
        });
        it('should define duplicate_record_pairs', () => {
            expect(attributes.duplicate_record_pairs).toEqual({
                attributes: ['reason', 'ignore']
            });
        });
        it('should define google_integrations', () => {
            expect(attributes.google_integrations).toEqual({
                attributes: [
                    'account_list', 'calendar_integration', 'calendar_integrations', 'calendar_id', 'calendar_name',
                    'email_blacklist', 'email_integration', 'contacts_integration'
                ],
                account_list: { ref: 'id' }
            });
        });
        it('should define imports', () => {
            expect(attributes.imports).toEqual({
                attributes: [
                    'file_headers', 'file_headers_mappings', 'file_constants', 'file_constants_mappings',
                    'sample_contacts', 'in_preview', 'tag_list', 'source_account', 'groups', 'import_by_group',
                    'in_preview', 'override', 'source', 'source_account_id', 'group_tags'
                ],
                sample_contacts: { ref: 'id' },
                source_account: { ref: 'id' },
                typeForAttribute: jasmine.any(Function)
            });
        });
        it('should define impersonation', () => {
            expect(attributes.impersonation).toEqual({
                attributes: ['user', 'reason'],
                pluralizeType: false
            });
        });
        it('should define merge', () => {
            expect(attributes.merge).toEqual({
                attributes: ['account_list_to_merge'],
                typeForAttribute: jasmine.any(Function),
                account_list_to_merge: { ref: 'id' },
                pluralizeType: false
            });
        });
        it('should define merges', () => {
            expect(attributes.merges).toEqual({
                attributes: ['winner_id', 'loser_id']
            });
        });
        it('should define notifications', () => {
            expect(attributes.notifications).toEqual({
                attributes: [
                    'contact_id', 'notification_type_id', 'event_date', 'cleared', 'created_at', 'updated_at',
                    'donation_id'
                ]
            });
        });
        it('should define organization_accounts', () => {
            expect(attributes.organization_accounts).toEqual({
                attributes: ['organization', 'password', 'username', 'person'],
                organization: { ref: 'id' },
                person: { ref: 'id' }
            });
        });
        it('should define organizations', () => {
            expect(attributes.organizations).toEqual({
                attributes: ['name', 'org_help_url', 'country', 'gift_aid_percentage']
            });
        });
        it('should define people', () => {
            expect(attributes.people).toEqual({
                attributes: [
                    'first_name', 'legal_first_name', 'last_name', 'birthday_month', 'birthday_year', 'birthday_day',
                    'anniversary_month', 'anniversary_year', 'anniversary_day', 'title', 'suffix', 'gender',
                    'marital_status', 'preferences', 'sign_in_count', 'current_sign_in_at', 'last_sign_in_at',
                    'current_sign_in_ip', 'last_sign_in_ip', 'created_at', 'updated_at', 'master_person_id',
                    'middle_name', 'access_token', 'profession', 'deceased', 'subscribed_to_updates',
                    'optout_enewsletter', 'occupation', 'employer', 'not_duplicated_with', 'phone_numbers',
                    'email_addresses', 'facebook_accounts', 'family_relationships', 'linkedin_accounts',
                    'twitter_accounts', 'websites', 'winner_id', 'loser_id'
                ],
                email_addresses: {
                    ref: 'id',
                    attributes: [
                        'email', 'primary', 'remote_id', 'location', 'historic', 'source', 'valid_values', '_destroy'
                    ]
                },
                facebook_accounts: {
                    ref: 'id',
                    attributes: ['_destroy', 'username']
                },
                family_relationships: {
                    ref: 'id',
                    attributes: ['_destroy', 'related_person', 'relationship', 'created_at'],
                    related_person: { ref: 'id' }
                },
                linkedin_accounts: {
                    ref: 'id',
                    attributes: ['_destroy', 'public_url']
                },
                phone_numbers: {
                    ref: 'id',
                    attributes: [
                        'number', 'country_code', 'location', 'primary', 'updated_at', 'remote_id', 'historic',
                        'source', 'valid_values', '_destroy'
                    ]
                },
                twitter_accounts: {
                    ref: 'id',
                    attributes: ['_destroy', 'screen_name']
                },
                websites: {
                    ref: 'id',
                    attributes: ['_destroy', 'url', 'primary']
                },
                typeForAttribute: jasmine.any(Function)
            });
        });
        it('should define resets', () => {
            expect(attributes.resets).toEqual({
                attributes: ['resetted_user_email', 'reason', 'account_list_name']
            });
        });
        it('should define tasks', () => {
            expect(attributes.tasks).toEqual({
                attributes: [
                    'account_list', 'activity_contacts', 'activity_type', 'comments', 'completed', 'completed_at',
                    'created_at', 'contacts', 'due_date', 'end_at', 'location', 'next_action', 'no_date',
                    'notification_id', 'notification_time_before', 'notification_time_unit', 'notification_scheduled',
                    'notification_type', 'remote_id', 'result', 'source', 'starred', 'start_at', 'subject', 'tag_list',
                    'type', 'updated_at'
                ],
                account_list: { ref: 'id' },
                activity_contacts: {
                    ref: 'id',
                    attributes: ['_destroy'],
                    contact: { ref: 'id' }
                },
                comments: {
                    ref: 'id',
                    attributes: ['body', 'person'],
                    person: { ref: 'id' }
                },
                contacts: { ref: 'id' }
            });
        });
        it('should define tags', () => {
            expect(attributes.tags).toEqual({
                attributes: ['name']
            });
        }); it('should define user_options', () => {
            expect(attributes.user_options).toEqual({
                attributes: ['key', 'value']
            });
        }); it('should define user', () => {
            expect(attributes.user).toEqual({
                attributes: [
                    'first_name', 'last_name', 'preferences', 'setup', 'email_addresses', 'access_token', 'time_zone',
                    'locale', 'updated_at'
                ],
                email_addresses: {
                    ref: 'id',
                    attributes: ['email']
                }
            });
        }); it('should define mail_chimp_account', () => {
            expect(attributes.mail_chimp_account).toEqual({
                attributes: ['api_key', 'primary_list_id', 'sync_all_active_contacts', 'auto_log_campaigns']
            });
        });
    });
});
