import has from 'lodash/fp/has';
import map from 'lodash/fp/map';
import moment from 'moment';
import uuid from 'uuid/v1';
import createPatch from 'common/fp/createPatch';

class PersonModalController {
    constructor(
        $log, $rootScope, $scope, gettextCatalog,
        alerts, people, locale, modal,
        api, contact, person
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.alerts = alerts;
        this.api = api;
        this.contact = contact;
        this.gettextCatalog = gettextCatalog;
        this.locale = locale;
        this.modal = modal;
        this.people = people;
        this.person = person;

        this.personDetails = '';
        this.maps = [];
        this.activeTab = 'contact-info';

        this.activate();
    }
    activate() {
        if (has('id', this.person)) {
            this.personInitialState = angular.copy(this.person);
            this.modalTitle = this.gettextCatalog.getString('Edit Person');
            // bad data is bad
            if (this.person.birthday_year) {
                this.person.birthday = moment(`${this.person.birthday_year}-${this.person.birthday_month}-${this.person.birthday_day}`, 'YYYY-MM-DD').toDate();
            }
            if (this.person.anniversary_year) {
                this.person.anniversary = moment(`${this.person.anniversary_year}-${this.person.anniversary_month}-${this.person.anniversary_day}`, 'YYYY-MM-DD').toDate();
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
        // bad data is bad
        if (this.person.birthday) {
            const birthday = moment(this.person.birthday);
            this.person.birthday_year = birthday.year();
            this.person.birthday_month = birthday.month() + 1;
            this.person.birthday_day = birthday.date();
        }
        if (this.person.anniversary) {
            const anniversary = moment(this.person.anniversary);
            this.person.anniversary_year = anniversary.year();
            this.person.anniversary_month = anniversary.month() + 1;
            this.person.anniversary_day = anniversary.date();
        }

        if (has('id', this.person)) {
            const patch = createPatch(this.personInitialState, this.person);
            /* istanbul ignore next */
            this.$log.debug('person patch', patch);
            return this.people.save(patch).then(() => {
                /* istanbul ignore next */
                this.$log.debug('person saved:', this.person);
                this.$rootScope.$emit('personUpdated');
                this.alerts.addAlert(this.gettextCatalog.getString('Changes saved successfully.'));
                this.$scope.$hide();
            }).catch((err) => {
                this.alerts.addAlert(this.gettextCatalog.getString('Unable to save changes.'), 'danger', null, 5, true);
                throw err;
            });
        } else {
            return this.api.post(`contacts/${this.contact.id}/people`, this.person).then(() => {
                /* istanbul ignore next */
                this.$log.debug('person created:', this.person);
                this.$rootScope.$emit('personUpdated');
                this.alerts.addAlert(this.gettextCatalog.getString('Changes saved successfully.'));
                this.$scope.$hide();
            }).catch((err) => {
                this.alerts.addAlert(this.gettextCatalog.getString('Unable to save changes.'), 'danger', null, 5, true);
                throw err;
            });
        }
    }
    changeTab(form, tab) {
        if (form.$valid) {
            this.activeTab = tab;
        } else {
            this.alerts.addAlert(this.gettextCatalog.getString('Please complete required fields before changing tabs'), 'danger', null, 5, true);
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
                this.$scope.$hide();
            });
        });
    }
}

import alerts from 'common/alerts/alerts.service';
import locale from 'common/locale/locale.service';
import modal from 'common/modal/modal.service';
import people from '../people.service';

export default angular.module('mpdx.contacts.show.personModal.controller', [
    alerts, locale, modal, people
]).controller('personModalController', PersonModalController).name;
