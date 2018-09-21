// This class provides all of the meta information needed to serialize jsonapi data
import { defaultTo } from 'lodash/fp';

export const contactsTypeForAttribute = (key: string) =>
    defaultTo(key, {
        'contacts_referred_by_me': 'contacts',
        'referred_by': 'contacts',
        'primary_person': 'people',
        'contact_referrals_to_me': 'contact_referrals'
    }[key]);

export const importsTypeForAttribute = (key: string) =>
    defaultTo(key, {
        'sample_contacts': 'contacts',
        'source_account': 'google_accounts'
    }[key]);

export const mergeTypeForAttribute = (key) => key === 'account_list_to_merge' ? 'account_lists' : key;

export const peopleTypeForAttribute = (key) => key === 'related_person' ? 'people' : key;

export class EntityAttributes {
    attributes: any;
    constructor() {
        this.attributes = {
            account_list_invites: {
                attributes: [
                    'accepted_at', 'accepted_by_user_id', 'account_list_id', 'cancelled_by_user_id', 'code',
                    'created_at', 'invited_by_user_id', 'recipient_email', 'invite_user_as', 'updated_at'
                ]
            },
            account_lists: {
                attributes: [
                    'creator_id', 'created_at', 'currency', 'home_country', 'monthly_goal', 'name',
                    'primary_appeal', 'settings', 'salary_organization', 'tester',
                    'total_pledges', 'updated_at'
                ],
                primary_appeal: {
                    ref: 'id'
                },
                users: {
                    ref: 'id',
                    attributes: ['first_name', 'last_name', 'avatar']
                }
            },
            addresses: {
                attributes: [
                    'city', 'country', 'end_date', 'geo', 'historic', 'location', 'metro_area', 'postal_code',
                    'primary_mailing_address', 'region', 'start_date', 'state', 'street', 'valid_values'
                ]
            },
            appeals: {
                attributes: [
                    'account_list', 'amount', 'contacts', 'created_at', 'currencies', 'description', 'donations',
                    'end_date', 'name', 'total_currency', 'contact_statuses', 'contact_tags', 'contact_exclude',
                    'tag_list', 'updated_at', 'inclusion_filter', 'exclusion_filter'
                ],
                account_list: { ref: 'id' }
            },
            appeal_contacts: {
                attributes: [
                    'appeal', 'contact', 'force_list_deletion'
                ],
                appeal: { ref: 'id' },
                contact: { ref: 'id' }
            },
            bulk: {
                attributes: ['tag_name'],
                pluralizeType: false
            },
            comments: {
                attributes: ['body', 'person'],
                person: { ref: 'id', pluralizeType: false }
            },
            contacts: {
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
                    attributes: ['referred_by', '_destroy'],
                    contacts: { ref: 'id' }
                },
                typeForAttribute: contactsTypeForAttribute
            },
            designation_accounts: {
                attributes: [
                    'active'
                ]
            },
            donations: {
                attributes: [
                    'amount', 'appeal', 'appeal_amount', 'channel', 'created_at', 'designation_account',
                    'donation_date', 'donor_account', 'motivation', 'payment_method', 'payment_type', 'remote_id',
                    'tendered_currency', 'tendered_amount', 'currency', 'memo', 'updated_at'
                ],
                designation_account: { ref: 'id' },
                donor_account: { ref: 'id' },
                appeal: { ref: 'id' }
            },
            duplicate_record_pairs: {
                attributes: ['reason', 'ignore']
            },
            export_logs: {
                attributes: ['params']
            },
            google_integrations: {
                attributes: [
                    'account_list', 'calendar_integration', 'calendar_integrations', 'calendar_id', 'calendar_name',
                    'email_blacklist', 'email_integration', 'contacts_integration'
                ],
                account_list: { ref: 'id' }
            },
            imports: {
                attributes: [
                    'file_headers', 'file_headers_mappings', 'file_constants', 'file_constants_mappings',
                    'sample_contacts', 'in_preview', 'tag_list', 'source_account', 'groups', 'import_by_group',
                    'in_preview', 'override', 'source', 'source_account_id', 'group_tags'
                ],
                sample_contacts: { ref: 'id' },
                source_account: { ref: 'id' },
                typeForAttribute: importsTypeForAttribute
            },
            impersonation: {
                attributes: ['user', 'reason'],
                pluralizeType: false
            },
            merge: {
                attributes: ['account_list_to_merge'],
                typeForAttribute: mergeTypeForAttribute,
                account_list_to_merge: { ref: 'id' },
                pluralizeType: false
            },
            merges: {
                attributes: ['winner_id', 'loser_id']
            },
            notifications: {
                attributes: [
                    'contact_id', 'notification_type_id', 'event_date', 'cleared', 'created_at', 'updated_at',
                    'donation_id'
                ]
            },
            notification_preferences: {
                ref: 'id',
                attributes: ['email', 'notification_type', 'task', 'user'],
                notification_type: { ref: 'id' },
                user: { ref: 'id' }
            },
            organization_accounts: {
                attributes: ['organization', 'password', 'username', 'person'],
                organization: { ref: 'id' },
                person: { ref: 'id' }
            },
            organizations: {
                attributes: ['name', 'org_help_url', 'country', 'gift_aid_percentage']
            },
            pledges: {
                attributes: ['amount', 'amount_currency', 'expected_date', 'appeal', 'contact', 'status'],
                contact: { ref: 'id' },
                appeal: { ref: 'id' }
            },
            people: {
                attributes: [
                    'first_name', 'legal_first_name', 'last_name', 'birthday_month', 'birthday_year', 'birthday_day',
                    'anniversary_month', 'anniversary_year', 'anniversary_day', 'title', 'suffix', 'gender',
                    'marital_status', 'preferences', 'sign_in_count', 'current_sign_in_at', 'last_sign_in_at',
                    'current_sign_in_ip', 'last_sign_in_ip', 'created_at', 'updated_at', 'master_person_id',
                    'middle_name', 'access_token', 'profession', 'deceased', 'subscribed_to_updates',
                    'optout_enewsletter', 'occupation', 'employer', 'not_duplicated_with', 'phone_numbers',
                    'email_addresses', 'facebook_accounts', 'family_relationships', 'linkedin_accounts',
                    'twitter_accounts', 'websites', 'winner_id', 'loser_id', 'age'
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
                typeForAttribute: peopleTypeForAttribute
            },
            resets: {
                attributes: ['resetted_user_email', 'reason', 'account_list_name']
            },
            tasks: {
                attributes: [
                    'account_list', 'activity_contacts', 'activity_type', 'comments', 'completed', 'completed_at',
                    'created_at', 'contacts', 'due_date', 'end_at', 'location', 'next_action', 'no_date',
                    'notification_id', 'notification_time_before', 'notification_time_unit', 'notification_scheduled',
                    'notification_type', 'remote_id', 'result', 'source', 'starred', 'start_at', 'subject',
                    'subject_hidden', 'tag_list', 'type', 'updated_at'
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
            },
            tags: {
                attributes: ['name']
            },
            user: {
                attributes: [
                    'first_name', 'last_name', 'preferences', 'setup', 'email_addresses', 'access_token', 'time_zone',
                    'locale', 'updated_at'
                ],
                email_addresses: {
                    ref: 'id',
                    attributes: ['email']
                }
            },
            user_options: {
                attributes: ['key', 'value']
            },
            weekly_report: {
                attributes: ['answers', 'user_id'],
                answers: {
                    attributes: ['question_id', 'answer']
                }
            },
            mail_chimp_account: {
                attributes: ['api_key', 'primary_list_id', 'auto_log_campaigns']
            }
        };
    }
}
