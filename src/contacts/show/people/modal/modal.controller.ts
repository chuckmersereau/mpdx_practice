import * as uuid from 'uuid/v1';
import { ApiService } from '../../../../common/api/api.service';
import { has, map } from 'lodash/fp';
import alerts, { AlertsService } from '../../../../common/alerts/alerts.service';
import createPatch from '../../../../common/fp/createPatch';
import locale, { LocaleService } from '../../../../common/locale/locale.service';
import modal, { ModalService } from '../../../../common/modal/modal.service';
import people, { PeopleService } from '../people.service';

class PersonModalController {
    activeTab: string;
    maps: any[];
    modalTitle: string;
    personDetails: string;
    personInitialState: any;
    suffixes: string[];
    titles: string[];
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private alerts: AlertsService,
        private api: ApiService,
        private people: PeopleService,
        private locale: LocaleService,
        private modal: ModalService,
        private contact: any,
        private person: any,
        private userProfile: any
    ) {
        this.personDetails = '';
        this.maps = [];
        this.activeTab = 'contact-info';

        this.titles = [
            'Mr.', 'Mrs.', 'Miss', 'Ms.', 'Rev.', 'Hon.', 'Dr.', 'Frau', 'Mlle', 'Mr. and Mrs.', 'Mme', 'Rev', 'M.',
            'Esq.', 'Jr.', 'Messrs.', 'Mmes.', 'Msgr.', 'Prof.', 'Rt. Hon.', 'St.'
        ];
        this.suffixes = ['Jr.', 'Sr.', 'MD.'];
        this.activate();
    }
    activate() {
        if (has('id', this.person)) {
            this.personInitialState = angular.copy(this.person);
            if (this.userProfile) {
                this.modalTitle = this.gettextCatalog.getString('Edit My Profile');
            } else {
                this.modalTitle = this.gettextCatalog.getString('Edit Person');
            }
        } else {
            this.modalTitle = this.gettextCatalog.getString('Add Person');
            this.person = {
                email_addresses: [],
                phone_numbers: [],
                family_relationships: [],
                facebook_accounts: [],
                twitter_accounts: [],
                linkedin_accounts: [],
                websites: []
            };
        }
    }
    save() {
        const errorMessage = this.gettextCatalog.getString('Unable to save changes.');
        const successMessage = this.gettextCatalog.getString('Changes saved successfully.');
        if (has('id', this.person)) {
            const patch = createPatch(this.personInitialState, this.person);
            /* istanbul ignore next */
            this.$log.debug('person patch', patch);
            console.log(patch);
            return this.people.save(patch, successMessage, errorMessage).then(() => {
                /* istanbul ignore next */
                this.$log.debug('person saved:', this.person);
                this.$rootScope.$emit('personUpdated', this.person.id);
                this.$scope.$hide();
            });
        } else {
            return this.api.post(`contacts/${this.contact.id}/people`, this.person, successMessage, errorMessage).then((person: any) => {
                /* istanbul ignore next */
                this.$log.debug('person created:', this.person);
                this.$rootScope.$emit('personCreated', person.id);
                this.$scope.$hide();
            });
        }
    }
    changeTab(form, tab) {
        if (form.$valid) {
            this.activeTab = tab;
        } else {
            this.alerts.addAlert(this.gettextCatalog.getString('Please complete required fields before changing tabs'), 'danger', 5);
        }
    }
    remove(property, index) {
        if (this.person[property][index].new) {
            this.person[property].splice(index, 1);
        } else {
            this.person[property][index]._destroy = 1;
        }
    }
    addEmailAddress() {
        this.person.email_addresses.push({ id: uuid(), email: '', location: '', new: true });
    }
    addPhone() {
        this.person.phone_numbers.push({ id: uuid(), number: '', location: '', new: true });
    }
    addFamilyRelationship() {
        this.person.family_relationships.push({ id: uuid(), related_person: { id: null }, new: true });
    }
    addFacebook() {
        this.person.facebook_accounts.push({ id: uuid(), username: '', new: true });
    }
    addTwitter() {
        this.person.twitter_accounts.push({ id: uuid(), screen_name: '', new: true });
    }
    addLinkedin() {
        this.person.linkedin_accounts.push({ id: uuid(), username: '', new: true });
    }
    addWebsite() {
        this.person.websites.push({ id: uuid(), url: '', new: true });
    }
    changePrimary(property, id) {
        this.person[property] = map((val) => {
            val.primary = val.id === id;
            return val;
        }, this.person[property]);
    }
    changeHistoric(obj) {
        obj.historic = !obj.historic;
    }
    delete() {
        return this.modal.confirm(this.gettextCatalog.getString('Are you sure you wish to delete this person?')).then(() => {
            return this.api.delete({
                url: `contacts/people/${this.person.id}`,
                data: {
                    id: this.person.id
                },
                type: 'people'
            }).then(() => {
                this.$rootScope.$emit('personDeleted', this.person.id);
                this.$scope.$hide();
            });
        });
    }
}

export default angular.module('mpdx.contacts.show.personModal.controller', [
    alerts, locale, modal, people
]).controller('personModalController', PersonModalController).name;
