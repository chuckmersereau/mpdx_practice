import has from 'lodash/fp/has';
import map from 'lodash/fp/map';
import moment from 'moment';
import uuid from 'uuid/v1';

class PersonModalController {
    contact;
    people;
    contacts;

    constructor(
        $log, $scope,
        people, contact, locale, person
    ) {
        this.$log = $log;
        this.$scope = $scope;
        this.contact = contact;
        this.locale = locale;
        this.people = people;
        this.person = person;

        this.personDetails = '';
        this.maps = [];
        this.activeTab = 'contact-info';

        this.activate();
    }
    activate() {
        if (has('id', this.person)) {
            this.modalTitle = 'Edit Person';
            //bad data is bad
            if (this.person.birthday_year) {
                this.person.birthday = moment(`${this.person.birthday_year}-${this.person.birthday_month}-${this.person.birthday_day}`, 'YYYY-MM-DD').toDate();
            }
            if (this.person.anniversary_year) {
                this.person.anniversary = moment(`${this.person.anniversary_year}-${this.person.anniversary_month}-${this.person.anniversary_day}`, 'YYYY-MM-DD').toDate();
            }
        } else {
            this.modalTitle = 'Add Person';
            this.person = {
                email_addresses: [],
                phone_numbers: [],
                family_relationships: [],
                networks: []
            };
        }
    }
    save() {
        //bad data is bad
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
            return this.people.save(this.contact.id, this.person).then(() => {
                this.$log.debug('person saved:', this.person);
                this.$scope.$hide();
            });
        } else {
            return this.people.create(this.contact.id, this.person).then(() => {
                this.$log.debug('person created:', this.person);
                this.$scope.$hide();
            });
        }
    }
    remove(property, index) {
        this.person[property].splice(index, 1);
    }
    addEmailAddress() {
        this.person.email_addresses.push({id: uuid(), email: '', location: ''});
    }
    addPhone() {
        this.person.phone_numbers.push({id: uuid(), number: '', location: ''});
    }
    addFamilyRelationship() {
        this.person.family_relationships.push({id: uuid(), related_person: {id: null}});
    }
    addFacebook() {
        this.person.facebook_accounts.push({id: uuid(), username: ''});
    }
    addTwitter() {
        this.person.twitter_accounts.push({id: uuid(), screen_name: ''});
    }
    addLinkedin() {
        this.person.linkedin_accounts.push({id: uuid(), username: ''});
    }
    addWebsite() {
        this.person.websites.push({id: uuid(), url: ''});
    }
    changePrimary(property, id) {
        this.person[property] = map(val => {
            val.primary = val.id === id;
            return val;
        }, this.person[property]);
    }
    changeHistoric(obj) {
        obj.historic = !obj.historic;
    }
    delete() {
        this.person._destroy = 1;
        return this.save();
    }
}

export default angular.module('mpdx.contacts.show.personModal.controller', [])
    .controller('personModalController', PersonModalController).name;
