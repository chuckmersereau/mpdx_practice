import 'angular-gettext';
import * as Upload from 'ng-file-upload';
import * as uuid from 'uuid/v1';
import { isFunction } from 'lodash/fp';
import api, { ApiService } from '../../../common/api/api.service';
import config from '../../../config';
import contacts, { ContactsService } from '../../contacts.service';
import modal, { ModalService } from '../../../common/modal/modal.service';

export class PeopleService {
    data: any;
    includes: string;
    constructor(
        private $filter: ng.IFilterService,
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private Upload: ng.angularFileUpload.IUploadService,
        private api: ApiService,
        private contacts: ContactsService,
        private modal: ModalService
    ) {
        this.includes = 'email_addresses,facebook_accounts,family_relationships,family_relationships.related_person,'
            + 'linkedin_accounts,master_person,phone_numbers,twitter_accounts,websites';
        this.data = [];
    }
    get(personId) {
        return this.api.get(`contacts/people/${personId}`, { include: this.includes }).then((data) => {
            this.$log.debug(`contacts/people/${personId}`, data);
            return data;
        });
    }
    list(contactId) {
        return this.api.get(`contacts/${contactId}/people`, { include: this.includes });
    }
    listAll(reset = false) {
        if (!reset && this.data.length > 0) {
            return this.$q.resolve(this.data);
        }
        return this.api.get('contacts/people', {
            filter: {
                account_list_id: this.api.account_list_id
            },
            fields: {
                people: 'first_name,last_name'
            },
            per_page: 10000
        }).then((data) => {
            this.data = data;
            return data;
        });
    }
    merge(contact, winnerId, loserId) {
        return this.api.post(
            `contacts/${contact.id}/people/merges`,
            { winner_id: winnerId, loser_id: loserId }
        ).then((data: any) => {
            if (isFunction(data.success)) {
                data.success();
            }
            return data;
        });
    }
    bulkMerge(winnersAndLosers, errorMessage?) {
        return this.api.post({
            url: 'contacts/people/merges/bulk',
            data: winnersAndLosers,
            type: 'people',
            errorMessage: errorMessage,
            fields: {
                people: ''
            }
        }).then((data: any) => {
            if (isFunction(data.success)) {
                data.success();
            }
            return data;
        });
    }
    save(person, successMessage?, errorMessage?) {
        console.log('PEOPLE SERVICE / SAVE:', person);
        return this.api.put({
            url: `contacts/people/${person.id}`,
            data: person,
            type: 'people',
            successMessage: successMessage,
            errorMessage: errorMessage
        }); // reload after use, otherwise add reconcile
    }
    updateAvatar(person, avatar) {
        const pictureId = uuid();
        return this.Upload.upload({
            url: `${config.apiUrl}contacts/people/${person.id}`,
            method: 'PUT',
            arrayKey: '[]',
            data: {
                data: {
                    id: person.id,
                    type: 'people',
                    attributes: {
                        overwrite: true
                    },
                    relationships: {
                        pictures: {
                            data: [{
                                id: pictureId,
                                type: 'pictures'
                            }]
                        }
                    }
                },
                included: [
                    {
                        id: pictureId,
                        type: 'pictures',
                        attributes: {
                            image: avatar,
                            primary: true
                        }
                    }
                ]
            }
        });
    }
    bulkSave(people) {
        return this.api.put({
            url: 'contacts/people/bulk',
            data: people,
            type: 'people',
            fields: {
                people: ''
            }
        });
    }
    deleteEmailAddress(person, emailAddress) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete this email address?');
        return this.modal.confirm(message).then(() => {
            // cannot delete phone object directly
            return this.api.put({
                url: `contacts/people/${person.id}`,
                data: {
                    id: person.id,
                    email_addresses: [
                        {
                            id: emailAddress.id,
                            _destroy: 1
                        }
                    ]
                },
                type: 'people'
            });
        });
    }
    saveEmailAddress(person, emailAddress) {
        if (!emailAddress.email) { return this.$q.reject(); }
        return this.api.put({
            url: `contacts/people/${person.id}`,
            data: {
                id: person.id,
                email_addresses: [
                    emailAddress
                ]
            },
            type: 'people'
        });
    }
    deletePhoneNumber(person, phoneNumber) {
        const message = this.gettextCatalog.getString('Are you sure you wish to delete this phone number?');
        return this.modal.confirm(message).then(() => {
            // cannot delete phone object directly
            return this.api.put({
                url: `contacts/people/${person.id}`,
                data: {
                    id: person.id,
                    phone_numbers: [
                        {
                            id: phoneNumber.id,
                            _destroy: 1
                        }
                    ]
                },
                type: 'people'
            });
        });
    }
    savePhoneNumber(person, phoneNumber) {
        if (!phoneNumber.number) { return this.$q.reject(); }
        return this.api.put({
            url: `contacts/people/${person.id}`,
            data: {
                id: person.id,
                phone_numbers: [
                    phoneNumber
                ]
            },
            type: 'people'
        });
    }
    openPeopleModal(contact, personId?, userProfile = false) {
        const modalOpen = (contact, person) => {
            return this.modal.open({
                template: require('./modal/modal.html'),
                controller: 'personModalController',
                locals: {
                    contact: contact,
                    person: person,
                    userProfile: userProfile
                }
            });
        };

        if (personId) {
            return this.get(personId).then((person) => {
                return modalOpen(contact, person);
            });
        } else {
            return modalOpen(contact, {});
        }
    }
    openMergePeopleModal(selectedPeople) {
        return this.modal.open({
            template: require('./merge/merge.html'),
            controller: 'mergePeopleModalController',
            locals: {
                selectedPeople: selectedPeople
            }
        });
    }
}

export default angular.module('mpdx.contacts.show.people.service', [
    'gettext', Upload,
    api, contacts, modal
]).service('people', PeopleService).name;
